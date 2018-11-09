## talk-plugin-publisher-notifications
Notifies Superdesk Publisher API endpoint when new comment is created.


## Coral Talk setup
- upload plugin to plugins folder
- add plugin to plugins.default.json
```
"server": [
    ...
    "talk-plugin-publisher-notifications"
]
```
- setup .env variable
```
TALK_PUBLISHER_API_URL=https://domain.com/api/v1/
TALK_PUBLISHER_AUTH_TOKEN=0dcd1953d72dda47f4a4acedfd638a3c58def7bc
```
[How to generate token](https://superdesk-publisher.readthedocs.io/en/latest/cookbooks/implementators/secure_content_push.html)
