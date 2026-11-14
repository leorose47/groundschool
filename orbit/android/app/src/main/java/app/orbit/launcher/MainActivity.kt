package app.orbit.launcher

import android.Manifest
import android.app.Activity
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream

/**
 * Orbit launcher: a home-screen replacement whose UI is the Orbit web app.
 * The web app gets `window.OrbitNative` with: listApps(), appIcon(pkg), launchApp(pkg), notify(title, body).
 */
class MainActivity : Activity() {
    private lateinit var web: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Serve bundled assets from a real https origin so fetch()/localStorage behave normally.
        val loader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        web = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false
            addJavascriptInterface(Bridge(), "OrbitNative")
            webChromeClient = object : WebChromeClient() {
                override fun onPermissionRequest(request: PermissionRequest) = request.grant(request.resources)
            }
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(view: WebView, req: WebResourceRequest) =
                    loader.shouldInterceptRequest(req.url)

                // Hand tel:, sms:, mailto:, other app deep links and external sites to Android.
                override fun shouldOverrideUrlLoading(view: WebView, req: WebResourceRequest): Boolean {
                    val url = req.url
                    if (url.host == "appassets.androidplatform.net") return false
                    return try { startActivity(Intent(Intent.ACTION_VIEW, url)); true } catch (e: Exception) { true }
                }
            }
        }
        setContentView(web)
        web.loadUrl("https://appassets.androidplatform.net/assets/index.html")

        if (Build.VERSION.SDK_INT >= 33) requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1)
        requestPermissions(arrayOf(Manifest.permission.RECORD_AUDIO), 2)
    }

    // As a launcher, Back should never leave the home screen.
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() { if (web.canGoBack()) web.goBack() }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        web.evaluateJavascript("go && go('home')", null)   // Home button returns to the dashboard
    }

    inner class Bridge {
        @JavascriptInterface
        fun listApps(): String {
            val pm = packageManager
            val main = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
            val arr = JSONArray()
            pm.queryIntentActivities(main, 0)
                .filter { it.activityInfo.packageName != packageName }
                .sortedBy { it.loadLabel(pm).toString().lowercase() }
                .forEach {
                    arr.put(JSONObject().put("label", it.loadLabel(pm).toString()).put("pkg", it.activityInfo.packageName))
                }
            return arr.toString()
        }

        @JavascriptInterface
        fun appIcon(pkg: String): String {
            val d = packageManager.getApplicationIcon(pkg)
            val bmp = Bitmap.createBitmap(96, 96, Bitmap.Config.ARGB_8888)
            d.setBounds(0, 0, 96, 96); d.draw(Canvas(bmp))
            val out = ByteArrayOutputStream(); bmp.compress(Bitmap.CompressFormat.PNG, 100, out)
            return Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP)
        }

        @JavascriptInterface
        fun launchApp(pkg: String) {
            packageManager.getLaunchIntentForPackage(pkg)?.let { runOnUiThread { startActivity(it) } }
        }

        @JavascriptInterface
        fun notify(title: String, body: String) {
            val nm = getSystemService(NotificationManager::class.java)
            nm.createNotificationChannel(NotificationChannel("orbit", "Reminders", NotificationManager.IMPORTANCE_HIGH))
            val tap = PendingIntent.getActivity(this@MainActivity, 0,
                Intent(this@MainActivity, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
            val n = android.app.Notification.Builder(this@MainActivity, "orbit")
                .setSmallIcon(android.R.drawable.ic_popup_reminder)
                .setContentTitle(title).setContentText(body)
                .setContentIntent(tap).setAutoCancel(true).build()
            nm.notify(System.currentTimeMillis().toInt(), n)
        }
    }
}
