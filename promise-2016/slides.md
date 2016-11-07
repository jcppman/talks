class: center, middle
# I PROMISE!

In 2016, this is (almost) all you need to know about async in js.

---

# Agenda
--

- A Quick Review of JS Event Loop and the whole picture
--

- Promise: The CORE
--

- Generator: Mimic the sync world
--

- Async/await: The fanciness

---

# Event Looooooooooooop

```
	while(pendingCallbacks.length > 0) {
		// check if there's any satisfied callbacks

		// execute all satisfied callbacks
	}
```

---
layout: true
# Be a time lord
---

- setTimeout

Say we have a Component
```
	// MyUIComponent implementation
	function MyUICompoment() {
		this.trigger('selected');
	}

```
--

We new an instance and attach the handler
```

	var file = new MyUIComponent();
	component.on('selected', function () {
		console.log('I am selected!');
	});

```
--

Nothing happend... Why?
---

To fix it:
```

	// MyUIComponent implementation
	function MyUICompoment() {
		setTimeout(function () {
			this.trigger('selected');
		}, 0);
	}

```

--

But MOM! There might be whole bunch of callbacks in between, I want it NOW!

---

To make it happens earlier:
- nextTick (Node.js Exclusive)

```
	while(pendingCallbacks.length > 0) {
		// ** handle nextTick functions **

		// check if there's any satisfied callbacks

		// execute all satisfied callbacks
	}

```

--

Problem?

---

- setImmediate

```

	// pendingCallbacks = [taskA, taskB, taskC];

	setImmediate(taskZ);

	// pendingCallbacks = [taskZ, taskA, taskB, taskC];

```

---
layout: false
# An awesomeness

In terms of concurrency model 

Bringin in all cool stuff like WebWorker, ServiceWorker, iframe...

--

No additional complicity

---

# The Progression

```
Callback
    => [Async.js](https://github.com/caolan/async)
        => Promise
            => Generator + Promise
                => Async/Await
```

--

The reason is:

--

** Intuitive is the king **

More intuitive, less mistakes, more predictable

---
class: center, middle
# Promise

---

## Why is Promise important? 

--

### Promise is the core of modern js async
--

### Promise is the core of modern js async
--

### Promise is the core of modern js async
--

- Generator and Async/Await are all based on promise
--

- Easy to manage

---

## The main purpose of this sharing

--

- Trap oriented => Knowledge oriented
--

- No more confusing edge cases
	- racing
	- a.then, a.then, a.then

---

## [Promise/A+] (https://promisesaplus.com/)

--

Promise is:
--

- It has three states
	- pending
	- fulfilled
	- rejected
--

- `State === 'Pending'` once created
--

- only two paths:
	- pending => fulfilled with a given value
	- pending => rejected with a given reason
--

- `then`-able, whenever we `then`:
	- the first function will be executed with the fulfilled value
	- the second funciton will be executed with the rejected reason
	- `then` return a promise

---
Now we are able to answer most of the confusing cases:

```

	var a = getAPromise();

	// a is resolved with value 'A'

	// a is resolved with value 'B'

	a.then(function (value) {
		console.log(value);
	});
	
```

---

```

	var a = getAPromise();

	a.then(function (value) {
		console.log(value);
	}, function (reason) {
		console.log('rejected', reason);
	});

	// a is resolved with value 'A'

	a.then(function (value) {
		console.log(value);
	}, function (reason) {
		console.log('rejected', reason);
	});

	// a is rejected with reason 'blah blah blah'

	a.then(function (value) {
		console.log(value);
	}, function (reason) {
		console.log('rejected', reason);
	});
	
```

---
layout: true
## To start a new promise
---

### Deferred

```
	var deferred = Promise.defer();

	doSomething(function () {
		deferred.resolve();
	});

	return deferred.promise;
```

---

### Function injection

```
new Promise(function (resolve, reject) {
	// do something
	resolve();
});

```

---
layout: false
### Deferred is not recommended/deprecated

--

- Function injection can catch thrown exceptions
--

- INTUITIVE IS THE KING: Function injection encourages dev to write self-explained code blocks

---

### ES6 Promise

Only includes essential stuff:

--

- Start a promise:
	- `new Promise(function (resolve, reject) {});`
	- `Promise.resolve(value)`
	- `Promise.reject(reason`
--

- `promise.then`
--

- `Promise.all`
--

- `Promise.race` (any)

---

### Example

```
function enterPage(options) {
	// login first
	return doLogin().then(function (client) {
		var promises = [];

		// get user info
		var pUser = client.getUserInfo(sessionKey).then(function (userInfo) {
			// do something
		}, function (err) {
			// error handling and recover
			return client.forceLogin();
		});
		promises.push(pUser);

		// feed app info to ppl who need it
		var pInfo = client.getAppInfo(sessionKey).then(function (appInfo) {
			otherStuff.set(appInfo.appName);
		});
		promises.push(pInfo);

		// setup something
		client.setDebugLevel(options.debugLevel);

		// load assets
		promise.push(loadAssets(client.getUserAssetUrls));

		return Promise.all(promises);
	});
}

```

---
class: center, middle

### Wanna write something equivalant with just callbacks?

---

## Next step

Promise is cool, but:

--

- `then` will still introduce one level of idents

--

- good for complicated stuff, but *visually* overwhelming for straight forward
stuff

---

## Do you miss the synchronized world?

Our goal:

```
	client.doLogin()

	data = client.getData()

	parsedXML = parseXML(data)
```

---
class: center, middle
# Generator

---
layout: true
## A generator is:

---

- something you can get values from it

```
	function genFactory() {
		var value = 0;
		return {
			next: function () {
				return {
					value: value++,
					done: false
				};
			}
		};
	}

	var g = genFactory();

	var fistValue = g.next().value;

	console.log(firstValue);

	var secondValue = g.next().value;

	console.log(secondValue);

	// ....
```

---

- and new syntax make it looks prettier

```
	function *gen () {
		var value = 0, inc = 0;
		while(true) {
			value = value + inc;
			inc = yield value;
		}
	}
```

--

- so it become something "pause-able"

---
layout: false

## So use generator + promise to do async looks like:

```
	function* doSomething() {
		var data = yield getData(); // getData is a function who returns a promise
		
		var type = data.type;
		
		var content = yield getContent(type);
		
		return translate(content);
	}

	execute(doSomething).then(function (result) {
		// I get the result!
	});
```

---

and the helper function `execute` might be something like:

--

- accept a generator as argument
--

- keep executing the generator
	- whenever the generator yield something, get the value and feed it back
	- if done, return the last value

---

## This is good, but not good enough, because:

--

- need some helpers to achieve this
--

- INTUITIVE IS THE KING
--

	- function* looks awful
--

	- I'm trying to get a value, not given out, yield doesn't make sense
--


So...

---
class: middle, center
# Async/Await

---

### Same concept, same form, just prettier

--

```

	async function doSomething () {
		var data = await getData(); // getData is a function who returns a promise
		
		var type = data.type;

		var content = await getContent(type);

		return translate(content);
	}

	// THIS LOOKS GOOD!
	read().then(function (result) {
		// I get the result!
	});

```

--

- No new wheel: The same good old Promise
--

- Straight forward logic
--

- You can see it as a syntax sugar for the pattern `generator + promise`
    - `yield` => `await`
    - `function*` => `async function`
    - built-in executer

---

# Conclusion
--

- Async/Await is based upon Promises
--

- Promise is based upon Callbacks
--

- Callbacks is based upon JS event loop
--


They form the whole js async pulling model

---

## Take away

--

- If you are a function, you're dealing with a promise, you either:
	- return it to your caller
	- end it with proper error handling
--

- If you are already using generator and compile it to ES5:
	- use Async/Await comfortably

---

# Another direction: PUSH!

Wait! You promised to talke about stream, eventemitter, RxJs.....

--

## promise.STATE: Pending...

---
class: center, middle

# THANKS!
