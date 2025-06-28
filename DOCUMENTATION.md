# Simple Programming Language (SPL) - Technical Documentation

## 🌐 [**Try SPL Online - Live IDE**](https://asleshsura.github.io/SimpleProgrammingLanguage/) 🚀

---

## Table of Contents

1. [Language Overview](#language-overview)
2. [Lexical Structure](#lexical-structure)
3. [Data Types](#data-types)
4. [Operators](#operators)
5. [Control Flow](#control-flow)
6. [Built-in Methods](#built-in-methods)
7. [Static Methods](#static-methods)
8. [Error Handling](#error-handling)
9. [Grammar Specification](#grammar-specification)
10. [Implementation Details](#implementation-details)

---

## Language Overview

Simple Programming Language (SPL) is a dynamically-typed, interpreted programming language designed for educational purposes and rapid prototyping. It features:

- **Dynamic Typing**: Variables can hold values of any type
- **Object-Oriented Methods**: Built-in methods for all data types
- **Method Chaining**: Support for fluent interfaces
- **Static Methods**: Class-level utility functions
- **Memory Management**: Automatic garbage collection via JavaScript runtime
- **Browser-Based**: Runs entirely in web browsers using Pyodide

### Design Principles

1. **Simplicity**: Easy to learn syntax similar to Python and JavaScript
2. **Consistency**: Uniform method naming and behavior across types
3. **Expressiveness**: Support for complex operations through method chaining
4. **Safety**: Runtime type checking and comprehensive error reporting

---

## Lexical Structure

### Tokens

SPL recognizes the following token types:

#### Keywords
```
if, else, while, for, in, break, True, False, and, or, not, range
```

#### Operators
```
Arithmetic: +, -, *, /, %
Comparison: ==, !=, <, <=, >, >=
Assignment: =
Logical: and, or, not
```

#### Delimiters
```
Parentheses: ( )
Brackets: [ ]
Braces: { }
Semicolon: ;
Comma: ,
Dot: .
```

#### Literals
- **Numbers**: Integer and floating-point literals
  - Examples: `42`, `3.14`, `-17`, `0.5`
- **Strings**: Double-quoted string literals
  - Examples: `"hello"`, `"world"`, `""`
- **Booleans**: `True`, `False`

#### Identifiers
- Must start with a letter or underscore
- Can contain letters, digits, and underscores
- Case-sensitive
- Examples: `name`, `_private`, `counter1`

#### Comments
- Single-line comments start with `#`
- Example: `# This is a comment`

### Whitespace and Line Endings

- Whitespace (spaces, tabs) is ignored except for indentation context
- Statements are terminated by semicolons (`;`)
- Newlines are generally ignored unless they separate statements

---

## Data Types

### Number

Represents both integers and floating-point numbers.

**Internal Representation**: JavaScript Number (64-bit floating point)

**Literal Syntax**:
```spl
42          # Integer
3.14        # Float
-17         # Negative integer
0.5         # Decimal
```

**Methods**:
- `abs()` → Number: Absolute value
- `sign()` → Number: Sign (-1, 0, 1)
- `round(digits?)` → Number: Round to specified decimal places
- `floor()` → Number: Round down to nearest integer
- `ceil()` → Number: Round up to nearest integer
- `sqrt()` → Number: Square root
- `pow(exponent)` → Number: Raise to power
- `tostring()` → String: Convert to string representation

### String

Represents sequences of Unicode characters.

**Internal Representation**: JavaScript String (UTF-16)

**Literal Syntax**:
```spl
"hello"     # Basic string
"world!"    # String with punctuation
""          # Empty string
```

**Methods**:
- `length()` → Number: String length
- `upper()` → String: Convert to uppercase
- `lower()` → String: Convert to lowercase
- `strip()` → String: Remove leading/trailing whitespace
- `startswith(prefix)` → Boolean: Check if starts with prefix
- `endswith(suffix)` → Boolean: Check if ends with suffix
- `contains(substring)` → Boolean: Check if contains substring
- `find(substring)` → Number: Find index of substring (-1 if not found)
- `replace(old, new)` → String: Replace all occurrences
- `split(separator?)` → List: Split into list of strings
- `slice(start, end?)` → String: Extract substring

### Boolean

Represents logical truth values.

**Internal Representation**: JavaScript Boolean

**Literal Syntax**:
```spl
True        # Boolean true
False       # Boolean false
```

**Methods**:
- `tostring()` → String: Convert to string ("true" or "false")
- `tonumber()` → Number: Convert to number (1.0 or 0.0)
- `not()` → Boolean: Logical negation

### List

Represents ordered collections of values.

**Internal Representation**: JavaScript Array

**Literal Syntax**:
```spl
[1, 2, 3]           # List of numbers
["a", "b", "c"]     # List of strings
[1, "hello", True]  # Mixed-type list
[]                  # Empty list
```

**Indexing Syntax**:
```spl
list[0]     # First element
list[1]     # Second element
```

**Methods**:
- `length()` → Number: List length
- `contains(value)` → Boolean: Check if contains value
- `index(value)` → Number: Find index of value (-1 if not found)
- `append(value)` → None: Add value to end
- `prepend(value)` → None: Add value to beginning
- `pop()` → Any: Remove and return last element
- `remove(value)` → None: Remove first occurrence of value
- `sort()` → None: Sort list in-place
- `reverse()` → None: Reverse list in-place
- `slice(start, end?)` → List: Extract sublist
- `join(separator?)` → String: Join elements into string
- `copy()` → List: Create shallow copy
- `clear()` → None: Remove all elements

---

## Operators

### Arithmetic Operators

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| `+` | Addition | `5 + 3` | `8` |
| `-` | Subtraction | `5 - 3` | `2` |
| `*` | Multiplication | `5 * 3` | `15` |
| `/` | Division | `6 / 3` | `2.0` |
| `%` | Modulo | `7 % 3` | `1` |

### Comparison Operators

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| `==` | Equal | `5 == 5` | `True` |
| `!=` | Not equal | `5 != 3` | `True` |
| `<` | Less than | `3 < 5` | `True` |
| `<=` | Less than or equal | `5 <= 5` | `True` |
| `>` | Greater than | `5 > 3` | `True` |
| `>=` | Greater than or equal | `5 >= 3` | `True` |

### Logical Operators

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| `and` | Logical AND | `True and False` | `False` |
| `or` | Logical OR | `True or False` | `True` |
| `not` | Logical NOT | `not True` | `False` |

### Operator Precedence

From highest to lowest precedence:

1. Method calls (`.`)
2. Unary operators (`not`, `-`)
3. Multiplicative (`*`, `/`, `%`)
4. Additive (`+`, `-`)
5. Comparison (`<`, `<=`, `>`, `>=`)
6. Equality (`==`, `!=`)
7. Logical AND (`and`)
8. Logical OR (`or`)
9. Assignment (`=`)

---

## Control Flow

### If Statements

```spl
if condition {
    # statements
} else {
    # statements
}
```

**Syntax Rules**:
- Condition must evaluate to a boolean
- Braces `{}` are required
- `else` clause is optional

### While Loops

```spl
while condition {
    # statements
    break;  # optional early exit
}
```

**Syntax Rules**:
- Condition must evaluate to a boolean
- `break` statement exits the loop immediately
- Infinite loops are possible if condition never becomes false

### For Loops

```spl
# Iterate over range
for variable in range(start, end, step) {
    # statements
}

# Iterate over list
for variable in list {
    # statements
}
```

**Syntax Rules**:
- Variable is automatically declared in loop scope
- `range(n)` creates sequence 0 to n-1
- `range(start, end)` creates sequence start to end-1
- `range(start, end, step)` creates sequence with custom step
- `break` statement exits the loop immediately

---

## Built-in Methods

### String Methods

#### Information Methods
- **`length()`** → Number
  - Returns the number of characters in the string
  - Example: `"hello".length()` → `5`

#### Transformation Methods
- **`upper()`** → String
  - Converts all characters to uppercase
  - Example: `"hello".upper()` → `"HELLO"`

- **`lower()`** → String
  - Converts all characters to lowercase
  - Example: `"HELLO".lower()` → `"hello"`

- **`strip()`** → String
  - Removes leading and trailing whitespace
  - Example: `"  hello  ".strip()` → `"hello"`

#### Search Methods
- **`startswith(prefix)`** → Boolean
  - Checks if string starts with the given prefix
  - Example: `"hello".startswith("he")` → `True`

- **`endswith(suffix)`** → Boolean
  - Checks if string ends with the given suffix
  - Example: `"hello".endswith("lo")` → `True`

- **`contains(substring)`** → Boolean
  - Checks if string contains the given substring
  - Example: `"hello".contains("ell")` → `True`

- **`find(substring)`** → Number
  - Returns index of first occurrence of substring, -1 if not found
  - Example: `"hello".find("ell")` → `1`

#### Manipulation Methods
- **`replace(old, new)`** → String
  - Replaces all occurrences of old substring with new substring
  - Example: `"hello world".replace("world", "SPL")` → `"hello SPL"`

- **`split(separator?)`** → List
  - Splits string into list using separator (default: single space)
  - Example: `"a,b,c".split(",")` → `["a", "b", "c"]`

- **`slice(start, end?)`** → String
  - Extracts substring from start index to end index (exclusive)
  - Example: `"hello".slice(1, 3)` → `"el"`

### Number Methods

#### Information Methods
- **`abs()`** → Number
  - Returns absolute value
  - Example: `(-5).abs()` → `5`

- **`sign()`** → Number
  - Returns -1 for negative, 0 for zero, 1 for positive
  - Example: `(-5).sign()` → `-1`

#### Rounding Methods
- **`round(digits?)`** → Number
  - Rounds to specified decimal places (default: 0)
  - Example: `3.14159.round(2)` → `3.14`

- **`floor()`** → Number
  - Rounds down to nearest integer
  - Example: `3.7.floor()` → `3`

- **`ceil()`** → Number
  - Rounds up to nearest integer
  - Example: `3.2.ceil()` → `4`

#### Mathematical Methods
- **`sqrt()`** → Number
  - Returns square root
  - Example: `16.sqrt()` → `4`

- **`pow(exponent)`** → Number
  - Raises number to given power
  - Example: `2.pow(3)` → `8`

#### Conversion Methods
- **`tostring()`** → String
  - Converts number to string representation
  - Example: `42.tostring()` → `"42"`

### Boolean Methods

- **`tostring()`** → String
  - Converts boolean to string ("true" or "false")
  - Example: `True.tostring()` → `"true"`

- **`tonumber()`** → Number
  - Converts boolean to number (1.0 or 0.0)
  - Example: `True.tonumber()` → `1.0`

- **`not()`** → Boolean
  - Returns logical negation
  - Example: `True.not()` → `False`

### List Methods

#### Information Methods
- **`length()`** → Number
  - Returns number of elements in list
  - Example: `[1, 2, 3].length()` → `3`

- **`contains(value)`** → Boolean
  - Checks if list contains the given value
  - Example: `[1, 2, 3].contains(2)` → `True`

- **`index(value)`** → Number
  - Returns index of first occurrence of value, -1 if not found
  - Example: `[1, 2, 3].index(2)` → `1`

#### Modification Methods
- **`append(value)`** → None
  - Adds value to end of list
  - Example: `list.append(4)` modifies list in-place

- **`prepend(value)`** → None
  - Adds value to beginning of list
  - Example: `list.prepend(0)` modifies list in-place

- **`pop()`** → Any
  - Removes and returns last element
  - Example: `[1, 2, 3].pop()` → `3`, list becomes `[1, 2]`

- **`remove(value)`** → None
  - Removes first occurrence of value
  - Example: `list.remove(2)` modifies list in-place

#### Transformation Methods
- **`sort()`** → None
  - Sorts list in ascending order (in-place)
  - Example: `[3, 1, 2].sort()` → list becomes `[1, 2, 3]`

- **`reverse()`** → None
  - Reverses list order (in-place)
  - Example: `[1, 2, 3].reverse()` → list becomes `[3, 2, 1]`

- **`slice(start, end?)`** → List
  - Returns new list with elements from start to end (exclusive)
  - Example: `[1, 2, 3, 4].slice(1, 3)` → `[2, 3]`

#### Utility Methods
- **`join(separator?)`** → String
  - Joins elements into string with separator (default: no separator)
  - Example: `[1, 2, 3].join(", ")` → `"1, 2, 3"`

- **`copy()`** → List
  - Creates shallow copy of list
  - Example: `original.copy()` → new list with same elements

- **`clear()`** → None
  - Removes all elements from list
  - Example: `list.clear()` → list becomes `[]`

---

## Static Methods

Static methods are called on class names rather than instances.

### Math Class

#### Constants
- **`Math.pi()`** → Number: Mathematical constant π (3.141592653589793)
- **`Math.e()`** → Number: Mathematical constant e (2.718281828459045)

#### Random Numbers
- **`Math.random()`** → Number: Random float between 0 and 1

#### Statistical Functions
- **`Math.max(list)`** → Number: Maximum value in list
- **`Math.min(list)`** → Number: Minimum value in list
- **`Math.sum(list)`** → Number: Sum of all values in list
- **`Math.average(list)`** → Number: Average of all values in list

#### Trigonometric Functions
- **`Math.sin(radians)`** → Number: Sine function
- **`Math.cos(radians)`** → Number: Cosine function
- **`Math.tan(radians)`** → Number: Tangent function
- **`Math.log(number)`** → Number: Natural logarithm

### String Class

#### Creation Methods
- **`String.fromcode(charCode)`** → String: Create string from ASCII/Unicode code
- **`String.repeat(string, count)`** → String: Repeat string n times
- **`String.join(list, separator?)`** → String: Join list elements into string

#### Character Constants
- **`String.ascii_letters()`** → String: All ASCII letters (a-z, A-Z)
- **`String.digits()`** → String: All digit characters (0-9)

### List Class

#### Creation Methods
- **`List.empty()`** → List: Create empty list
- **`List.fill(count, value)`** → List: Create list with repeated value
- **`List.range(start, end?, step?)`** → List: Create list from range
- **`List.from_string(string)`** → List: Convert string to list of characters

---

## Error Handling

SPL provides comprehensive error reporting for various types of runtime errors.

### Error Types

#### Type Errors
- **Invalid Method Call**: Calling non-existent method on a type
- **Invalid Argument Type**: Passing wrong type to method
- **Invalid Operation**: Performing unsupported operation

#### Runtime Errors
- **Division by Zero**: Dividing number by zero
- **Index Out of Bounds**: Accessing list element beyond bounds
- **Variable Not Defined**: Using undefined variable
- **Invalid Range**: Using invalid range parameters

#### Syntax Errors
- **Unexpected Token**: Invalid token in source code
- **Missing Delimiter**: Missing semicolon, brace, etc.
- **Invalid Expression**: Malformed expression

### Error Messages

Error messages include:
- **Error Type**: Clear classification of error
- **Location**: Line number where error occurred
- **Description**: Human-readable explanation
- **Context**: Relevant code snippet when possible

### Error Recovery

- Errors halt execution immediately
- Variable state is preserved for debugging
- Error output is displayed in IDE console
- Execution can be restarted after fixing errors

---

## Grammar Specification

### EBNF Grammar

```ebnf
program = statement*

statement = assignment_statement
          | expression_statement
          | if_statement
          | while_statement
          | for_statement
          | break_statement

assignment_statement = identifier "=" expression ";"

expression_statement = expression ";"

if_statement = "if" expression block ("else" block)?

while_statement = "while" expression block

for_statement = "for" identifier "in" expression block

break_statement = "break" ";"

block = "{" statement* "}"

expression = logical_or

logical_or = logical_and ("or" logical_and)*

logical_and = equality ("and" equality)*

equality = comparison (("==" | "!=") comparison)*

comparison = term (("<" | "<=" | ">" | ">=") term)*

term = factor (("+" | "-") factor)*

factor = unary (("*" | "/" | "%") unary)*

unary = ("not" | "-")* call

call = primary ("." identifier "(" argument_list? ")" | "[" expression "]")*

primary = identifier
        | number
        | string
        | boolean
        | list
        | "(" expression ")"
        | static_method_call

static_method_call = identifier "." identifier "(" argument_list? ")"

list = "[" (expression ("," expression)*)? "]"

argument_list = expression ("," expression)*

identifier = [a-zA-Z_][a-zA-Z0-9_]*

number = [0-9]+("."[0-9]+)?

string = '"' [^"]* '"'

boolean = "True" | "False"
```

### Parsing Strategy

SPL uses a **recursive descent parser** with the following characteristics:

- **Top-Down**: Parses from start symbol down to terminals
- **Predictive**: Uses lookahead to determine parse path
- **Left-Recursive Elimination**: Handles left recursion through iteration
- **Operator Precedence**: Implements precedence through grammar structure

---

## Implementation Details

### Runtime Architecture

#### Lexical Analysis
- **Input**: Source code string
- **Output**: Stream of tokens
- **Implementation**: Regular expression-based tokenizer
- **Features**: Line tracking, error recovery

#### Syntax Analysis
- **Input**: Token stream
- **Output**: Abstract Syntax Tree (AST)
- **Implementation**: Recursive descent parser
- **Features**: Precedence handling, error reporting

#### Semantic Analysis
- **Input**: AST
- **Output**: Annotated AST
- **Implementation**: Tree traversal with symbol table
- **Features**: Type checking, scope resolution

#### Code Execution
- **Input**: Annotated AST
- **Output**: Program results
- **Implementation**: Tree-walking interpreter
- **Features**: Dynamic typing, method dispatch

### Memory Management

- **Variables**: Stored in JavaScript objects (hash tables)
- **Scoping**: Lexical scoping with scope chain
- **Garbage Collection**: Automatic via JavaScript runtime
- **Method Resolution**: Dynamic dispatch with prototype chain

### Performance Characteristics

- **Startup Time**: ~2-3 seconds (Pyodide loading)
- **Parse Time**: O(n) where n is source code length
- **Execution Time**: O(m) where m is number of operations
- **Memory Usage**: Proportional to variable count and data size

### Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Requirements**: ES6 support, WebAssembly
- **Limitations**: No file system access, network restrictions
- **Benefits**: No installation, cross-platform, sandboxed

### Development Tools

- **Code Editor**: CodeMirror with syntax highlighting
- **Execution Engine**: Pyodide-based Python interpreter
- **Error Reporting**: Real-time error display
- **Variable Inspection**: Runtime state visualization

---

## Examples and Best Practices

### Code Style Guidelines

#### Naming Conventions
- Variables: `camelCase` or `snake_case`
- Methods: `lowercase()` with descriptive names
- Constants: Use static methods for constant values

#### Statement Structure
- Always terminate statements with semicolons
- Use braces for all control flow blocks
- Indent consistently (2 or 4 spaces)

#### Method Chaining
- Break long chains across multiple lines
- Use meaningful intermediate variables for complex chains
- Prefer readability over brevity

### Performance Tips

#### Efficient Data Manipulation
```spl
# Good: Use appropriate data structures
numbers = List.range(1, 1000);
total = Math.sum(numbers);

# Avoid: Nested loops for simple operations
total = 0;
for i in range(1000) {
    total = total + i;
}
```

#### String Processing
```spl
# Good: Use built-in methods
words = text.split(" ");
result = words.join("-");

# Avoid: Manual string building
result = "";
# Complex manual concatenation...
```

### Common Patterns

#### Input Validation
```spl
if value.length() > 0 and value.contains("@") {
    # Process valid email
} else {
    print("Invalid email format");
}
```

#### Data Processing Pipeline
```spl
result = data
    .filter_valid()
    .sort()
    .slice(0, 10)
    .join(", ");
```

#### Error-Safe Operations
```spl
index = items.index(target);
if index != -1 {
    found_item = items[index];
} else {
    print("Item not found");
}
```

---

## Appendices

### A. Reserved Words

```
if, else, while, for, in, break, True, False, and, or, not, range, print
```

### B. Built-in Functions

- `print(...)`: Output values to console
- `range(start?, end, step?)`: Generate numeric sequences

### C. ASCII Reference

Common ASCII codes for `String.fromcode()`:
- A-Z: 65-90
- a-z: 97-122
- 0-9: 48-57
- Space: 32
- Newline: 10

### D. Mathematical Constants

- π (pi): 3.141592653589793
- e (Euler's number): 2.718281828459045

---

*This documentation covers SPL version 2.0. For the latest updates and examples, visit the [online IDE](https://asleshsura.github.io/SimpleProgrammingLanguage/).*

**Last Updated**: June 2025
