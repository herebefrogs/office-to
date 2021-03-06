Collaborative logo design experiment

Quick start
-----------
- Empty the Firebase instance: https://oanda-office-to-logo.firebaseio.com/
- Load the Toronto Office render page in a web browser: https://oanda-office-to-logo.firebaseapp.com/render.html
- Visit https://oanda-office-to-logo.firebaseapp.com on your smartphone and follow on-screen instructions

Setup
-----
- enable Anonymous login (Firebase instance Dashboard > Login & Auth > Anonymous > Enable Anonymous User Authentication)
- seed Security Rules (Firebase instance Dashboard > Security & Rules) with:
<pre>
{
    "rules": {
        ".read": true,
        ".write": true,
        "users": {
            "$uid": {
                ".read": true,
                // grants write access to the owner of this user account whose uid must exactly match the key ($uid)
                ".write": "auth !== null && auth.uid === $uid"
            }
        }
    }
}
</pre>
