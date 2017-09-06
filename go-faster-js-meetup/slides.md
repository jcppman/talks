layout: true
class: left, middle
---

# GO FASTER! (And smoother)

A guide to heavy computation in the browser

---

# About me

## Chriest (pronounced Chris-t)

Work in Splunk Shanghai

---

## Say...

- You're building a web app
--

- which ppl can make music
--

- Web Audio API got your back, except:
--

**export as mp3**

---

## Solution

![lame](images/lame.gif)

---

## Problems
--

- file size
--

- not PWA-friendly
--

- too many efforts!
    - the web service itself
    - chunks uploading

---

## Let's do it on FE

---

## First thing: Binary data

How do we handle binary data in JS? How about...
--

```
var data = [ 56, 32, 0, 9, 12 ]; // one byte per item
```

--

- Waste of memory (Number is 64-bit Floating Point) 
--

- Waste of computational resource (you can't predict data's structure)

---

## FYI
regular js Array is **dynamic**, and either dense or sparse

---

### Dense

```
// create a dense array
var data = [1, 2, 3, 4, 5];
```

--

under the hood it uses c-like array structure to hold the contents

---

### Sparse

```
// create a sparse array
var data = [];
data[666] = 'pretty good';
```

under the hood it's an object-like structure

---

### Take away

Dont change the way you use an array

---

## ArrayBuffer

From MDN:
> The ArrayBuffer object is used to represent a generic, fixed-length raw binary data buffer

---

And there's two ways to read/manipulate the data 

--

- [TypedArray](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

--

- [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
---

## DEMO

In Memory:

0000 1111

---

## The computation (encoding Mp3)

---

## Option 1: Write your own in JS

---

## Problems

- hard
--

- slow

---

## Option 2: ~~Steal~~ Borrow the wheels from grandpa

--

There's many existing codec encoders, written in C

---

### Two things

- ASM.js
- Emscripten

---

## ASM.JS

--

> an extraordinarily optimizable, low-level subset of JavaScript
--


> to make JS engine's life easier

---

```

function f(i) {
    return i + 1;
}

```

will be turned into

--

```

function f(i) {
    i = i|0;
    return (i + 1)|0;
}

```

---

## JIT vs AOT

---

### JIT (Just In Time)

![JIT](images/jit-diagram.png)

---

### AOT (Ahead Of Time)

![AOT](images/aot-diagram.png)

---

## Emscripten

> A LLVM backend, compiles LLVM to ASJ.js

---

## LLVM

Code --(LLVM frontend)--> IR --(LLVM backend)--> Bytecode

---

## LLVM

Code --(LLVM frontend)--> IR **--(Emscripten)-->** Bytecode

---

### **So any languague who has LLVM frontend could be compiled to javascript**

--

in theory

---

ActionScript, Ada, C#, Common Lisp, Crystal, D, Delphi, Fortran, OpenGL Shading Language, Halide, Haskell, Java bytecode, Julia, Lua, Objective-C, Pony, Python, R, Ruby, Rust, CUDA, Scala, Swift, and Xojo.

---

## Is there something better?

---

## WebAssembly

--

- binary execution format
    - ultra compact
--

- supported by browsers natively
    - W3C Open Standard
--

- predictable performance
    - asm.js optimization might be affected by browser implementations
    - WebAssembly has no GC

---

![diagram](images/wasm.jpg)

---

## The ideal way to get .wasm

a compiler for LLVM-WebAssembly compilation

---

## A temporary solution

asm-to-wasm

---

C/C++ => LLVM => ASM.JS => WASM

---

```

var Module = WebAssembly.instantiate(codeBuffer);

// now we can use those methods
Module.exposedMethodA();
Module.exposedMethodB();
// ...

```

---

## One more problem: Blocking

---

## WebWorker

---

```

var worker = new Worker('myWorker.js');

```

---

## But how about all the js single-threaded goodies?

---

- **There's only one way to communicate with workers**
- the variable transfering

---

## Main

```

worker.postMessage({ name: 'jcppman' });

```

## Worker

```

onmessage = function(a, b, c) {
    // do things
};

```

---

## But we need to transfer huge data

---

## Transferable

js objects who implements the interface `Transferable`

--

the ownership could be transfered between threads

--

```

postMessage(message, transferable)

```

---

## A quick DEMO

---

## The final demo
