# Simple Programming Language (SPL) - Complete Online IDE

## 🌐 [**Try SPL Online - Live IDE**](https://asleshsura.github.io/SimpleProgrammingLanguage/) 🚀

*Click above to start coding immediately in your browser - no installation required!*

---

A powerful, feature-rich programming language with a modern browser-based IDE, powered by Pyodide. SPL combines simplicity with advanced features like object-oriented programming, built-in data type methods, and comprehensive standard library functions.

## 🚀 Language Features

### Core Data Types & Variables
```spl
# Numbers (integers and floats)
age = 25;
price = 99.99;
temperature = -10.5;

# Strings with full method support
name = "Alice";
message = "Hello, World!";

# Booleans with utility methods
isActive = True;
isComplete = False;

# Lists with comprehensive methods
numbers = [1, 2, 3, 4, 5];
fruits = ["apple", "banana", "cherry"];
mixed = [1, "hello", True, [1, 2]];
```

### Arithmetic & Comparison Operations
```spl
# Arithmetic operations
result = (10 + 5) * 2 - 3 / 1.5;
power = 2;
squared = power * power;

# Comparison operations
isGreater = 10 > 5;         # True
isEqual = "hello" == "hello"; # True
isNotEqual = 5 != 3;        # True
inRange = age >= 18;        # Boolean result
```

### Control Flow Structures
```spl
# If-else statements with braces
if age >= 18 {
    print("You are an adult");
} else {
    print("You are a minor");
}

# While loops with break support
counter = 0;
while counter < 5 {
    print("Count:", counter);
    counter = counter + 1;
    if counter == 3 {
        break;
    }
}

# For loops with ranges and lists
for i in range(5) {
    print("Number:", i);
}

for fruit in fruits {
    print("Fruit:", fruit);
}

# Advanced range usage
for i in range(1, 10, 2) {  # start, end, step
    print("Odd number:", i);
}
```

### String Methods & Manipulation
```spl
text = "  Hello, World!  ";

# String information
length = text.length();           # 17
isEmpty = "".length() == 0;       # True

# String transformation
upper = text.upper();             # "  HELLO, WORLD!  "
lower = text.lower();             # "  hello, world!  "
trimmed = text.strip();           # "Hello, World!"

# String analysis
startsHello = text.startswith("  Hello");  # True
endsExclaim = text.endswith("!  ");        # True
containsWorld = text.contains("World");     # True
position = text.find("World");             # 9

# String manipulation
replaced = text.replace("World", "Universe"); # "  Hello, Universe!  "
words = trimmed.split(", ");              # ["Hello", "World!"]
sliced = text.slice(2, 7);                # "Hello"

# Method chaining
formatted = "programming is fun".split(" ").join("-").upper();
# Result: "PROGRAMMING-IS-FUN"
```

### List Methods & Operations
```spl
numbers = [3, 1, 4, 1, 5];

# List information
size = numbers.length();          # 5
hasThree = numbers.contains(3);   # True
position = numbers.index(4);      # 2 (or -1 if not found)

# List modification
numbers.append(9);               # [3, 1, 4, 1, 5, 9]
numbers.prepend(0);              # [0, 3, 1, 4, 1, 5, 9]
popped = numbers.pop();          # 9, list becomes [0, 3, 1, 4, 1, 5]
numbers.remove(1);               # Removes first occurrence of 1

# List transformation
numbers.sort();                  # Sorts in-place: [0, 1, 3, 4, 5]
numbers.reverse();               # Reverses in-place: [5, 4, 3, 1, 0]
subset = numbers.slice(1, 4);    # [4, 3, 1]

# List utility
text = numbers.join(", ");       # "5, 4, 3, 1, 0"
backup = numbers.copy();         # Creates a copy
numbers.clear();                 # Empties the list
```

### Number Methods & Math Operations
```spl
value = -42.7856;

# Number information
absolute = value.abs();          # 42.7856
sign = value.sign();             # -1 (positive=1, negative=-1, zero=0)

# Number rounding
rounded = value.round();         # -43.0
precise = value.round(2);        # -42.79
floor = value.floor();           # -43.0
ceiling = value.ceil();          # -42.0

# Number conversion
text = value.tostring();         # "-42.7856"

# Mathematical operations
sqrt = 16.0.sqrt();              # 4.0
power = 2.0.pow(3);              # 8.0 (2^3)
```

### Boolean Methods & Logic
```spl
flag = True;

# Boolean conversion
text = flag.tostring();          # "true"
number = flag.tonumber();        # 1.0
opposite = flag.not();           # False

# Practical usage
isValid = True;
status = isValid.tostring().upper();  # "TRUE"
```

### Static Methods & Built-in Functions

#### Math Class
```spl
# Mathematical constants
pi = Math.pi();                  # 3.141592653589793
e = Math.e();                    # 2.718281828459045

# Random numbers
randomValue = Math.random();     # Random float between 0 and 1

# Statistical functions
data = [1, 5, 3, 9, 2];
maximum = Math.max(data);        # 9.0
minimum = Math.min(data);        # 1.0
total = Math.sum(data);          # 20.0
average = Math.average(data);    # 4.0

# Trigonometric functions
angle = Math.pi() / 4;           # 45 degrees in radians
sine = Math.sin(angle);          # ~0.707
cosine = Math.cos(angle);        # ~0.707
tangent = Math.tan(angle);       # ~1.0
logarithm = Math.log(Math.e());  # 1.0
```

#### String Class
```spl
# String creation from character codes
char = String.fromcode(65);      # "A"
greeting = String.fromcode(72);  # "H" (ASCII 72)

# String repetition
repeated = String.repeat("Hi! ", 3);  # "Hi! Hi! Hi! "

# String joining
words = ["apple", "banana", "cherry"];
joined = String.join(words, ", ");    # "apple, banana, cherry"
noSep = String.join(words);           # "applebananacherry"

# Character constants
letters = String.ascii_letters();     # "abc...XYZ"
digits = String.digits();             # "0123456789"
```

#### List Class
```spl
# List creation
empty = List.empty();                 # []
filled = List.fill(5, "hello");       # ["hello", "hello", "hello", "hello", "hello"]
sequence = List.range(1, 6);          # [1, 2, 3, 4, 5]
stepped = List.range(0, 10, 2);       # [0, 2, 4, 6, 8]

# String to list conversion
chars = List.from_string("hello");    # ["h", "e", "l", "l", "o"]
```

### Advanced Features

#### Method Chaining
```spl
# Complex string processing
result = "  hello world  "
    .strip()
    .split(" ")
    .join("-")
    .upper();
# Result: "HELLO-WORLD"

# List processing chain
processed = [5, 1, 8, 3, 2]
    .sort()
    .slice(1, 4)
    .join(" -> ");
# Result: "2 -> 3 -> 5"
```

#### List Indexing & Slicing
```spl
data = [10, 20, 30, 40, 50];

# Indexing
first = data[0];                 # 10
last = data[4];                  # 50

# Using variables as indices
index = 2;
middle = data[index];            # 30

# Combining with methods
sorted_data = [3, 1, 4, 1, 5];
sorted_data.sort();
second = sorted_data[1];         # 1 (after sorting)
```

#### Complex Expressions & Nested Operations
```spl
# Mathematical calculations
fibonacci = [1, 1, 2, 3, 5, 8, 13];
golden_ratio = fibonacci[6] / fibonacci[5];  # ~1.625

# String and number combinations
score = 87.8;
grade = "Your average is: " + score.round(1).tostring();

# Conditional expressions in loops
scores = [85, 92, 78, 96, 88];
excellent_count = 0;
for score in scores {
    if score > 90 {
        print("Excellent score:", score);
        excellent_count = excellent_count + 1;
    }
}
```

## 🖥️ IDE Features

### Development Environment
- **Modern Code Editor**: Syntax highlighting with CodeMirror
- **Real-time Execution**: Run SPL code instantly in the browser
- **Interactive Output**: Live display of print statements and results
- **Persistent Variables**: Variables maintain state between runs
- **Comprehensive Error Handling**: Clear, descriptive error messages
- **Example Library**: Pre-built code samples to get started
- **Keyboard Shortcuts**: Ctrl+Enter for quick execution

### User Interface
- **Split Layout**: Code editor on the left, output panel on the right
- **Status Indicator**: Shows loading progress and ready state
- **Control Buttons**: Run, Clear Output, and Load Example buttons
- **Responsive Design**: Works on desktop and mobile browsers

## 🎯 Complete Example Program

```spl
# SPL Comprehensive Feature Demo
print("=== SPL FEATURE SHOWCASE ===");

# Data types and variables
name = "SPL";
version = 2.0;
isAwesome = True;

print("Language:", name);
print("Version:", version);
print("Awesome:", isAwesome.tostring());

# List processing with methods
scores = [85, 92, 78, 96, 88];
scores.sort();
average = Math.sum(scores) / scores.length();

print("Sorted scores:", scores);
print("Average:", average.round(1));
print("Top score:", Math.max(scores));

# String manipulation with chaining
message = "programming is fun";
formatted = message.split(" ").join("-").upper();
print("Formatted message:", formatted);

# Advanced control flow
total = 0;
for score in scores {
    if score > 90 {
        print("Excellent score:", score);
        total = total + 1;
    }
}
print("Excellent scores count:", total);

# Mathematical operations
pi_approx = Math.pi().round(3);
random_val = Math.random().round(2);
print("Pi (3 decimals):", pi_approx);
print("Random value:", random_val);

# Static method usage
alphabet = String.ascii_letters().slice(0, 10);
numbers_range = List.range(1, 6);
print("First 10 letters:", alphabet);
print("Number range:", numbers_range);

print("=== DEMO COMPLETE ===");
```

## 🚀 Quick Start

1. **Open the IDE**: Launch `index.html` in any modern web browser
2. **Wait for Loading**: Status will change to "Ready!" when SPL is loaded
3. **Write Code**: Use the editor with full syntax highlighting
4. **Execute**: Click "Run Code" or press `Ctrl+Enter`
5. **View Results**: See output in the right panel immediately

## 📁 Project Structure

```
SimpleProgrammingLanguage/
├── index.html          # Main IDE interface
├── script.js           # Complete SPL interpreter in JavaScript
├── style.css           # Modern IDE styling
├── README.md           # This comprehensive guide
└── additional files... # Legacy Python implementations
```

## 🌐 Browser Support

- **Chrome/Chromium** (recommended)
- **Firefox** 
- **Safari**
- **Edge**

**Requirements**: JavaScript enabled, WebAssembly support (standard in all modern browsers)

## 🏗️ Technical Architecture

SPL uses **Pyodide** to run a complete Python interpreter in the browser:

- **Lexer**: Tokenizes SPL source code into meaningful symbols
- **Parser**: Builds Abstract Syntax Trees (AST) from tokens
- **Interpreter**: Executes AST nodes with full method resolution
- **Method System**: Object-oriented method calls with chaining support
- **Static Methods**: Class-level functions for utility operations
- **Variable Persistence**: Maintains program state between executions

## 🎓 Learning Path

SPL demonstrates advanced programming language concepts:

1. **Lexical Analysis**: Converting source code to tokens
2. **Syntax Parsing**: Building structured representations (AST)
3. **Semantic Analysis**: Understanding program meaning
4. **Execution Engine**: Running programs with proper scoping
5. **Object System**: Method resolution and chaining
6. **Error Handling**: Comprehensive error reporting
7. **Standard Library**: Built-in functions and utilities

---

**SPL represents a complete programming language implementation with modern features, running entirely in your browser. From basic arithmetic to complex object-oriented operations, SPL provides a powerful yet approachable platform for learning and experimentation.**

*This project showcases the fascinating world of programming language design and implementation - a 15+ hour journey of discovery that proves building your own language is both achievable and incredibly rewarding!* 🎉

**<hr>**

This project was also made for [Shipwrecked](https://shipwrecked.hackclub.com/)