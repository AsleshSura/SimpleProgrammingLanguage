let pyodide;
let codeEditor;

// Sample code examples
const examples = [
    `# Basic example
x = 5
print("Hello, World!")
print("x =", x)`,

    `# Variables and arithmetic
x = 5
y = 10
result = x + y * 2
print("Result:", result)

name = "Alice"
print("Hello", name)`,

    `# Conditional statements
x = 15

if x > 10:
    print("x is greater than 10")
    print("Value of x:", x)
else:
    print("x is not greater than 10")`,

    `# While loops
counter = 1
print("Counting to 5:")

while counter <= 5:
    print("Count:", counter)
    counter = counter + 1

print("Done counting!")`,

    `# Complex example
print("=== SPL Demo ===")

a = 5
b = 3
print("a =", a)
print("b =", b)

sum = a + b
product = a * b
print("Sum:", sum)
print("Product:", product)

if sum > 7:
    print("Sum is greater than 7")
    i = 1
    while i <= 3:
        print("Loop iteration:", i)
        i = i + 1

print("Program finished!")`
];

// Complete Python implementation embedded as a string
const pythonCode = `
# Complete Simple Programming Language Implementation

from enum import Enum
from typing import List, Any, Optional

class TokenType(Enum):
    NUMBER = "NUMBER"
    PLUS = "PLUS"
    MINUS = "MINUS"
    MULTIPLY = "MULTIPLY"
    DIVIDE = "DIVIDE"
    LPAREN = "LPAREN"
    RPAREN = "RPAREN"
    IDENTIFIER = "IDENTIFIER"
    STRING = "STRING"
    ASSIGN = "ASSIGN"
    IF = "IF"
    ELSE = "ELSE"
    WHILE = "WHILE"
    GREATER = "GREATER"
    LESS = "LESS"
    COLON = "COLON"
    EOF = "EOF"
    NEWLINE = "NEWLINE"
    PRINT = "PRINT"
    COMMA = "COMMA"

class Token:
    def __init__(self, type, value, line=1, column=1):
        self.type = type
        self.value = value
        self.line = line
        self.column = column
    
    def __repr__(self):
        return f"Token({self.type}, {self.value})"

class Lexer:
    def __init__(self, text):
        self.text = text
        self.pos = 0
        self.line = 1
        self.column = 1
        
    def error(self, message="Invalid character"):
        raise Exception(f"Lexer error at line {self.line}, column {self.column}: {message}")
    
    def peek(self, offset=0):
        pos = self.pos + offset
        if pos >= len(self.text):
            return None
        return self.text[pos]
    
    def advance(self):
        if self.pos < len(self.text) and self.text[self.pos] == '\\n':
            self.line += 1
            self.column = 1
        else:
            self.column += 1
        self.pos += 1
    
    def skip_whitespace(self):
        while self.pos < len(self.text) and self.text[self.pos] in ' \\t':
            self.advance()
    
    def skip_comment(self):
        while self.pos < len(self.text) and self.text[self.pos] != '\\n':
            self.advance()
    
    def read_number(self):
        result = ""
        while self.pos < len(self.text) and (self.text[self.pos].isdigit() or self.text[self.pos] == '.'):
            result += self.text[self.pos]
            self.advance()
        
        if '.' in result:
            return float(result)
        return int(result)
    
    def read_string(self):
        result = ""
        self.advance()  # Skip opening quote
        
        while self.pos < len(self.text) and self.text[self.pos] != '"':
            if self.text[self.pos] == '\\\\':
                self.advance()
                if self.pos < len(self.text):
                    if self.text[self.pos] == 'n':
                        result += '\\n'
                    elif self.text[self.pos] == 't':
                        result += '\\t'
                    elif self.text[self.pos] == '\\\\':
                        result += '\\\\'
                    elif self.text[self.pos] == '"':
                        result += '"'
                    else:
                        result += self.text[self.pos]
                    self.advance()
            else:
                result += self.text[self.pos]
                self.advance()
        
        if self.pos >= len(self.text):
            self.error("Unterminated string")
        
        self.advance()  # Skip closing quote
        return result
    
    def read_identifier(self):
        result = ""
        while (self.pos < len(self.text) and 
               (self.text[self.pos].isalnum() or self.text[self.pos] == '_')):
            result += self.text[self.pos]
            self.advance()
        return result
    
    def tokenize(self):
        tokens = []
        
        while self.pos < len(self.text):
            self.skip_whitespace()
            
            if self.pos >= len(self.text):
                break
            
            char = self.text[self.pos]
            
            # Comments
            if char == '#':
                self.skip_comment()
                continue
            
            # Newlines
            if char == '\\n':
                tokens.append(Token(TokenType.NEWLINE, '\\n', self.line, self.column))
                self.advance()
                continue
            
            # Numbers
            if char.isdigit():
                tokens.append(Token(TokenType.NUMBER, self.read_number(), self.line, self.column))
                continue
            
            # Strings
            if char == '"':
                tokens.append(Token(TokenType.STRING, self.read_string(), self.line, self.column))
                continue
            
            # Identifiers and keywords
            if char.isalpha() or char == '_':
                identifier = self.read_identifier()
                if identifier == 'if':
                    tokens.append(Token(TokenType.IF, identifier, self.line, self.column))
                elif identifier == 'else':
                    tokens.append(Token(TokenType.ELSE, identifier, self.line, self.column))
                elif identifier == 'while':
                    tokens.append(Token(TokenType.WHILE, identifier, self.line, self.column))
                elif identifier == 'print':
                    tokens.append(Token(TokenType.PRINT, identifier, self.line, self.column))
                else:
                    tokens.append(Token(TokenType.IDENTIFIER, identifier, self.line, self.column))
                continue
            
            # Single character tokens
            if char == '+':
                tokens.append(Token(TokenType.PLUS, char, self.line, self.column))
                self.advance()
            elif char == '-':
                tokens.append(Token(TokenType.MINUS, char, self.line, self.column))
                self.advance()
            elif char == '*':
                tokens.append(Token(TokenType.MULTIPLY, char, self.line, self.column))
                self.advance()
            elif char == '/':
                tokens.append(Token(TokenType.DIVIDE, char, self.line, self.column))
                self.advance()
            elif char == '(':
                tokens.append(Token(TokenType.LPAREN, char, self.line, self.column))
                self.advance()
            elif char == ')':
                tokens.append(Token(TokenType.RPAREN, char, self.line, self.column))
                self.advance()
            elif char == '=':
                tokens.append(Token(TokenType.ASSIGN, char, self.line, self.column))
                self.advance()
            elif char == '>':
                tokens.append(Token(TokenType.GREATER, char, self.line, self.column))
                self.advance()
            elif char == '<':
                tokens.append(Token(TokenType.LESS, char, self.line, self.column))
                self.advance()
            elif char == ':':
                tokens.append(Token(TokenType.COLON, char, self.line, self.column))
                self.advance()
            elif char == ',':
                tokens.append(Token(TokenType.COMMA, char, self.line, self.column))
                self.advance()
            else:
                self.error(f"Unexpected character '{char}'")
        
        tokens.append(Token(TokenType.EOF, None, self.line, self.column))
        return tokens

# AST Node classes
class ASTNode:
    pass

class Program(ASTNode):
    def __init__(self, statements):
        self.statements = statements

class Number(ASTNode):
    def __init__(self, value):
        self.value = value

class String(ASTNode):
    def __init__(self, value):
        self.value = value

class Identifier(ASTNode):
    def __init__(self, name):
        self.name = name

class BinaryOp(ASTNode):
    def __init__(self, left, operator, right):
        self.left = left
        self.operator = operator
        self.right = right

class UnaryOp(ASTNode):
    def __init__(self, operator, operand):
        self.operator = operator
        self.operand = operand

class Assignment(ASTNode):
    def __init__(self, name, value):
        self.name = name
        self.value = value

class PrintStatement(ASTNode):
    def __init__(self, arguments):
        self.arguments = arguments

class IfStatement(ASTNode):
    def __init__(self, condition, if_body, else_body=None):
        self.condition = condition
        self.if_body = if_body
        self.else_body = else_body

class WhileStatement(ASTNode):
    def __init__(self, condition, body):
        self.condition = condition
        self.body = body

# Parser
class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0
    
    def error(self, message="Unexpected token"):
        current_token = self.current_token()
        raise Exception(f"Parser error at line {current_token.line}: {message}. Got {current_token.type}")
    
    def current_token(self):
        if self.pos >= len(self.tokens):
            return self.tokens[-1]  # EOF token
        return self.tokens[self.pos]
    
    def peek_token(self, offset=1):
        pos = self.pos + offset
        if pos >= len(self.tokens):
            return self.tokens[-1]  # EOF token
        return self.tokens[pos]
    
    def advance(self):
        if self.pos < len(self.tokens) - 1:
            self.pos += 1
    
    def match(self, *token_types):
        return self.current_token().type in token_types
    
    def consume(self, token_type, message=""):
        if self.current_token().type != token_type:
            self.error(message or f"Expected {token_type}")
        token = self.current_token()
        self.advance()
        return token
    
    def skip_newlines(self):
        while self.match(TokenType.NEWLINE):
            self.advance()
    
    def parse(self):
        statements = []
        self.skip_newlines()
        
        while not self.match(TokenType.EOF):
            if self.match(TokenType.NEWLINE):
                self.advance()
                continue
            
            stmt = self.parse_statement()
            if stmt:
                statements.append(stmt)
            
            self.skip_newlines()
        
        return Program(statements)
    
    def parse_statement(self):
        if self.match(TokenType.PRINT):
            return self.parse_print()
        elif self.match(TokenType.IF):
            return self.parse_if()
        elif self.match(TokenType.WHILE):
            return self.parse_while()
        elif self.match(TokenType.IDENTIFIER) and self.peek_token().type == TokenType.ASSIGN:
            return self.parse_assignment()
        else:
            # Expression statement
            expr = self.parse_expression()
            return expr
    
    def parse_print(self):
        self.consume(TokenType.PRINT)
        self.consume(TokenType.LPAREN)
        
        arguments = []
        if not self.match(TokenType.RPAREN):
            arguments.append(self.parse_expression())
            while self.match(TokenType.COMMA):
                self.advance()
                arguments.append(self.parse_expression())
        
        self.consume(TokenType.RPAREN)
        return PrintStatement(arguments)
    
    def parse_assignment(self):
        name = self.consume(TokenType.IDENTIFIER).value
        self.consume(TokenType.ASSIGN)
        value = self.parse_expression()
        return Assignment(name, value)
    
    def parse_if(self):
        self.consume(TokenType.IF)
        condition = self.parse_expression()
        self.consume(TokenType.COLON)
        self.skip_newlines()
        
        if_body = []
        while not self.match(TokenType.ELSE, TokenType.EOF) and not (self.match(TokenType.IDENTIFIER) and self.peek_token().type != TokenType.ASSIGN):
            if self.match(TokenType.NEWLINE):
                self.advance()
                continue
            stmt = self.parse_statement()
            if stmt:
                if_body.append(stmt)
            if not self.match(TokenType.NEWLINE):
                break
            self.skip_newlines()
        
        else_body = None
        if self.match(TokenType.ELSE):
            self.advance()
            self.consume(TokenType.COLON)
            self.skip_newlines()
            
            else_body = []
            while not self.match(TokenType.EOF) and not (self.match(TokenType.IDENTIFIER) and self.peek_token().type != TokenType.ASSIGN):
                if self.match(TokenType.NEWLINE):
                    self.advance()
                    continue
                stmt = self.parse_statement()
                if stmt:
                    else_body.append(stmt)
                if not self.match(TokenType.NEWLINE):
                    break
                self.skip_newlines()
        
        return IfStatement(condition, if_body, else_body)
    
    def parse_while(self):
        self.consume(TokenType.WHILE)
        condition = self.parse_expression()
        self.consume(TokenType.COLON)
        self.skip_newlines()
        
        body = []
        while not self.match(TokenType.EOF) and not (self.match(TokenType.IDENTIFIER) and self.peek_token().type != TokenType.ASSIGN):
            if self.match(TokenType.NEWLINE):
                self.advance()
                continue
            stmt = self.parse_statement()
            if stmt:
                body.append(stmt)
            if not self.match(TokenType.NEWLINE):
                break
            self.skip_newlines()
        
        return WhileStatement(condition, body)
    
    def parse_expression(self):
        return self.parse_comparison()
    
    def parse_comparison(self):
        expr = self.parse_addition()
        
        while self.match(TokenType.GREATER, TokenType.LESS):
            operator = self.current_token()
            self.advance()
            right = self.parse_addition()
            expr = BinaryOp(expr, operator, right)
        
        return expr
    
    def parse_addition(self):
        expr = self.parse_multiplication()
        
        while self.match(TokenType.PLUS, TokenType.MINUS):
            operator = self.current_token()
            self.advance()
            right = self.parse_multiplication()
            expr = BinaryOp(expr, operator, right)
        
        return expr
    
    def parse_multiplication(self):
        expr = self.parse_unary()
        
        while self.match(TokenType.MULTIPLY, TokenType.DIVIDE):
            operator = self.current_token()
            self.advance()
            right = self.parse_unary()
            expr = BinaryOp(expr, operator, right)
        
        return expr
    
    def parse_unary(self):
        if self.match(TokenType.MINUS, TokenType.PLUS):
            operator = self.current_token()
            self.advance()
            expr = self.parse_unary()
            return UnaryOp(operator, expr)
        
        return self.parse_primary()
    
    def parse_primary(self):
        if self.match(TokenType.NUMBER):
            token = self.current_token()
            self.advance()
            return Number(token.value)
        
        if self.match(TokenType.STRING):
            token = self.current_token()
            self.advance()
            return String(token.value)
        
        if self.match(TokenType.IDENTIFIER):
            token = self.current_token()
            self.advance()
            return Identifier(token.value)
        
        if self.match(TokenType.LPAREN):
            self.advance()
            expr = self.parse_expression()
            self.consume(TokenType.RPAREN)
            return expr
        
        self.error("Expected number, string, identifier, or '('")

# Output handler for capturing print statements
class OutputHandler:
    def __init__(self):
        self.output = []
    
    def write(self, text):
        self.output.append(str(text))
    
    def get_output(self):
        return self.output
    
    def clear(self):
        self.output = []

# Interpreter
class Interpreter:
    def __init__(self):
        self.variables = {}
        self.output_handler = OutputHandler()
    
    def visit(self, node):
        method_name = f'visit_{type(node).__name__}'
        method = getattr(self, method_name, self.generic_visit)
        return method(node)
    
    def generic_visit(self, node):
        raise Exception(f'No visit_{type(node).__name__} method')
    
    def visit_Program(self, node):
        result = None
        for statement in node.statements:
            result = self.visit(statement)
        return result
    
    def visit_Number(self, node):
        return node.value
    
    def visit_String(self, node):
        return node.value
    
    def visit_Identifier(self, node):
        if node.name not in self.variables:
            raise Exception(f"Undefined variable: {node.name}")
        return self.variables[node.name]
    
    def visit_BinaryOp(self, node):
        left = self.visit(node.left)
        right = self.visit(node.right)
        
        if node.operator.type == TokenType.PLUS:
            if isinstance(left, str) or isinstance(right, str):
                return str(left) + str(right)
            return left + right
        elif node.operator.type == TokenType.MINUS:
            return left - right
        elif node.operator.type == TokenType.MULTIPLY:
            return left * right
        elif node.operator.type == TokenType.DIVIDE:
            if right == 0:
                raise Exception("Division by zero")
            return left / right
        elif node.operator.type == TokenType.GREATER:
            return left > right
        elif node.operator.type == TokenType.LESS:
            return left < right
        else:
            raise Exception(f"Unknown binary operator: {node.operator.type}")
    
    def visit_UnaryOp(self, node):
        operand = self.visit(node.operand)
        
        if node.operator.type == TokenType.MINUS:
            return -operand
        elif node.operator.type == TokenType.PLUS:
            return operand
        else:
            raise Exception(f"Unknown unary operator: {node.operator.type}")
    
    def visit_Assignment(self, node):
        value = self.visit(node.value)
        self.variables[node.name] = value
        return value
    
    def visit_PrintStatement(self, node):
        values = []
        for arg in node.arguments:
            value = self.visit(arg)
            values.append(str(value))
        
        output_line = " ".join(values)
        self.output_handler.write(output_line)
        return None
    
    def visit_IfStatement(self, node):
        condition = self.visit(node.condition)
        result = None
        
        if condition:
            for statement in node.if_body:
                result = self.visit(statement)
        elif node.else_body:
            for statement in node.else_body:
                result = self.visit(statement)
        
        return result
    
    def visit_WhileStatement(self, node):
        result = None
        while self.visit(node.condition):
            for statement in node.body:
                result = self.visit(statement)
        return result

# Global interpreter instance to maintain state
global_interpreter = Interpreter()

def run_spl_code(code):
    """Main function to execute SPL code"""
    try:
        # Use the global interpreter to maintain variable state
        global global_interpreter
        
        # Clear output from previous runs
        global_interpreter.output_handler.clear()
        
        # Parse and execute
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()
        result = global_interpreter.visit(ast)
        
        # Return output and any result
        output = global_interpreter.output_handler.get_output()
        return {
            'success': True,
            'output': output,
            'result': result,
            'variables': dict(global_interpreter.variables)
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'output': [],
            'result': None,
            'variables': dict(global_interpreter.variables) if global_interpreter else {}
        }

print("Simple Programming Language loaded successfully!")
`;

// Initialize Pyodide
async function initializePyodide() {
    try {
        pyodide = await loadPyodide();
        console.log("Pyodide loaded successfully");
        return true;
    } catch (error) {
        console.error("Failed to load Pyodide:", error);
        return false;
    }
}

// Initialize the code editor
function initializeEditor() {
    codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'python',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        lineWrapping: true,
        viewportMargin: Infinity
    });
    
    // Set initial example code
    codeEditor.setValue(examples[0]);
}

// Execute the user's code
async function runCode() {
    const runBtn = document.getElementById('run-btn');
    
    try {
        runBtn.disabled = true;
        runBtn.innerHTML = '<span class="btn-icon">⏳</span>Running...';
        
        const code = codeEditor.getValue().trim();
        if (!code) {
            addOutput("No code to execute!", "error");
            return;
        }
        
        // Clear previous output (keep welcome message)
        clearOutput(false);
        addOutput(`> Running code...`, "info");
        
        // Execute the code using our SPL function
        pyodide.globals.set('user_code', code);
        
        const result = pyodide.runPython(`
result = run_spl_code(user_code)
result
        `);
        
        // Display results
        if (result.success) {
            if (result.output && result.output.length > 0) {
                result.output.forEach(line => {
                    addOutput(line, "print");
                });
            } else if (result.result !== null && result.result !== undefined) {
                addOutput(result.result.toString(), "print");
            } else {
                addOutput("✓ Code executed successfully", "info");
            }
            
            // Show variable state if there are variables
            if (result.variables && Object.keys(result.variables).length > 0) {
                addOutput("", "info"); // Empty line
                addOutput("Variables:", "info");
                for (const [name, value] of Object.entries(result.variables)) {
                    addOutput(`  ${name} = ${value}`, "info");
                }
            }
        } else {
            addOutput(result.error, "error");
        }
        
    } catch (error) {
        console.error("JavaScript error:", error);
        addOutput(`JavaScript Error: ${error.message}`, "error");
        
        // Show helpful debugging info
        addOutput("", "error");
        addOutput("This might be a browser compatibility issue.", "error");
        addOutput("Try using a modern browser (Chrome, Firefox, Safari, Edge).", "error");
    } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = '<span class="btn-icon">▶</span>Run Code';
    }
}

// Add output to the display
function addOutput(text, type = "output") {
    const output = document.getElementById('output');
    const div = document.createElement('div');
    
    switch(type) {
        case "error":
            div.className = "error-line";
            break;
        case "print":
            div.className = "print-line";
            break;
        case "info":
            div.className = "output-line";
            break;
        default:
            div.className = "output-line";
    }
    
    div.textContent = text;
    output.appendChild(div);
    
    // Auto-scroll to bottom
    output.scrollTop = output.scrollHeight;
}

// Clear output
function clearOutput(keepWelcome = true) {
    const output = document.getElementById('output');
    if (keepWelcome) {
        output.innerHTML = `
            <div class="welcome-output">
                <p>🚀 Simple Programming Language IDE</p>
                <p>Write code on the left, click "Run Code" to execute.</p>
                <p>Supported features: variables, arithmetic, if/while statements, print function</p>
                <hr>
            </div>
        `;
    } else {
        // Keep welcome but remove execution output
        const welcomeDiv = output.querySelector('.welcome-output');
        output.innerHTML = '';
        if (welcomeDiv && keepWelcome) {
            output.appendChild(welcomeDiv);
        }
    }
}

// Load random example code
function loadExample() {
    const currentExample = examples[Math.floor(Math.random() * examples.length)];
    codeEditor.setValue(currentExample);
}

// Main initialization
async function main() {
    try {
        const status = document.getElementById('status');
        status.textContent = "Loading Pyodide...";
        
        // Initialize Pyodide
        const pyodideLoaded = await initializePyodide();
        if (!pyodideLoaded) {
            throw new Error("Failed to load Pyodide");
        }
        
        status.textContent = "Loading Simple Programming Language...";
        
        // Load the language
        await pyodide.runPythonAsync(pythonCode);
        
        status.textContent = "Ready! Write your code and click Run.";
        status.style.color = "#00ff00";
        
        // Enable controls
        document.getElementById('run-btn').disabled = false;
        
        console.log("SPL IDE ready!");
        
    } catch (error) {
        console.error("Initialization failed:", error);
        const status = document.getElementById('status');
        status.innerHTML = `
            <div style="color: #ff4444;">Error: ${error.message}</div>
            <div style="color: #ffaa00; font-size: 12px; margin-top: 5px;">
                Check browser console for details. Try refreshing the page.
            </div>
        `;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize editor
    initializeEditor();
    
    // Button event listeners
    document.getElementById('run-btn').addEventListener('click', runCode);
    document.getElementById('clear-btn').addEventListener('click', () => clearOutput(true));
    document.getElementById('example-btn').addEventListener('click', loadExample);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runCode();
        }
    });
    
    // Initialize everything
    main();
});
