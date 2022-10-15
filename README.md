
## whatsapp bot

### Extensions
you can load, reload, unload extension with send message to bot
make sure file saved inside folder <b>cog</b>!
- !load filename
- !unload filename
- !reload filename

filename is used as command. example cog/ping.js, so how to use it is: !ping
<br>

### Tutorial creating extensions
simple just define <b>function name</b> as <b>main</b>
example:
```javascript
'use stric'
message = 'Hello world'

async function hello_world(msg):
	await msg.reply(message);

module.exports = {
	main:  hello_world,
}
```

### !anime_countdown
- !anime_countdown title *( countdown new episode )*
- !anime_countdown trending *( trending anime )*
- !anime_countdown notify_on *( enable notification when new EPS released )*
- !anime_countdown notify_off *( disable notification when new EPS released )*
<br>

> *sorry for my bad in english language xD*