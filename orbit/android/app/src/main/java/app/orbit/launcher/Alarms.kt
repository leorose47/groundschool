package app.orbit.launcher

import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import org.json.JSONArray

/**
 * Reminder alarms that fire even when Orbit is closed, and survive reboots.
 * The web app sends the full list of future reminders; we persist it and (re)schedule.
 */
object Alarms {
    private const val PREFS = "orbit_alarms"
    private const val KEY = "list"

    fun replaceAll(ctx: Context, json: String) {
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val old = JSONArray(prefs.getString(KEY, "[]"))
        for (i in 0 until old.length()) cancel(ctx, old.getJSONObject(i).getString("id"))
        prefs.edit().putString(KEY, json).apply()
        scheduleAll(ctx)
    }

    fun scheduleAll(ctx: Context) {
        val arr = JSONArray(ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, "[]"))
        val now = System.currentTimeMillis()
        val am = ctx.getSystemService(AlarmManager::class.java)
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            val at = o.getLong("at")
            if (at <= now) continue
            val pi = pending(ctx, o.getString("id"), o.optString("text"))
            if (Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms())
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
            else
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)   // inexact fallback
        }
    }

    private fun cancel(ctx: Context, id: String) =
        ctx.getSystemService(AlarmManager::class.java).cancel(pending(ctx, id, null))

    // The data URI makes each reminder's PendingIntent unique (extras don't count for equality).
    private fun pending(ctx: Context, id: String, text: String?): PendingIntent {
        val i = Intent(ctx, AlarmReceiver::class.java)
            .setAction("app.orbit.REMINDER")
            .setData(Uri.parse("orbit://reminder/" + Uri.encode(id)))
        if (text != null) i.putExtra("text", text)
        return PendingIntent.getBroadcast(ctx, 0, i, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
    }

    fun notify(ctx: Context, title: String, body: String) {
        val nm = ctx.getSystemService(NotificationManager::class.java)
        nm.createNotificationChannel(NotificationChannel("orbit", "Reminders", NotificationManager.IMPORTANCE_HIGH))
        val tap = PendingIntent.getActivity(ctx, 0, Intent(ctx, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
        val n = Notification.Builder(ctx, "orbit")
            .setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setContentTitle(title).setContentText(body)
            .setContentIntent(tap).setAutoCancel(true).build()
        nm.notify(System.currentTimeMillis().toInt(), n)
    }
}

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) =
        Alarms.notify(ctx, "Orbit reminder", intent.getStringExtra("text") ?: "")
}

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) Alarms.scheduleAll(ctx)
    }
}
