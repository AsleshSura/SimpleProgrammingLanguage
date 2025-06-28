# Simple Programming Language - Online IDE

A robust, browser-based online IDE for the Simple Programming Language (SPL), powered by Pyodide.

## Features

### Language Support
- **Variables**: `x = 5`
- **Arithmetic Operations**: `+`, `-`, `*`, `/` with parentheses support
- **Comparisons**: `>`, `<`
- **Strings**: `"Hello World"`
- **Print Function**: `print("Hello", x)`
- **Control Flow**: 
  - `if`/`else` statements
  - `while` loops
- **Comments**: Lines starting with `#`

### IDE Features
- **Code Editor**: Syntax highlighting with CodeMirror
- **Live Execution**: Run SPL code in the browser
- **Output Panel**: View print statements and results
- **Variable Persistence**: Variables persist between executions
- **Error Handling**: Clear error messages
- **Example Code**: Load sample programs
- **Keyboard Shortcuts**: Ctrl+Enter to run code

## Usage

1. Open `index.html` in a modern web browser
2. Wait for Pyodide and SPL to load (status will show "Ready!")
3. Write your SPL code in the editor
4. Click "Run Code" or press Ctrl+Enter
5. View output in the right panel

### Example SPL Code

```spl
# Variables and arithmetic
x = 5
y = 10
result = x + y * 2
print("Result:", result)

# Conditionals
if result > 20:
    print("Result is large!")
else:
    print("Result is small")

# Loops
counter = 1
while counter <= 3:
    print("Count:", counter)
    counter = counter + 1
```

## Deployment

### Local Development
Simply open `index.html` in any modern web browser.

### GitHub Pages
1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch" and choose `main` branch
5. Your IDE will be available at `https://yourusername.github.io/repositoryname`

## File Structure

- `index.html` - Main IDE interface
- `script.js` - JavaScript code containing the SPL interpreter
- `style.css` - IDE styling
- `lexer.py`, `parser.py`, `AST.py`, `interpreter.py` - Python SPL implementation
- `main.py`, `test.py` - Command-line and testing utilities

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox 
- Safari
- Edge

**Requirements**: JavaScript enabled and WebAssembly support.

## Architecture

The IDE uses Pyodide to run a complete SPL interpreter in the browser, including:
- **Lexer**: Tokenizes SPL source code
- **Parser**: Builds Abstract Syntax Trees
- **Interpreter**: Executes SPL programs with variable persistence

---

Simple Programming Language (SPL) demonstrates the fundamentals of building a programming language interpreter, from lexical analysis to execution.
