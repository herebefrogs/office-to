Collaborative logo design experiment

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
