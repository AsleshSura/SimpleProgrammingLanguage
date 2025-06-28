let pyodide;
let codeEditor;

// Sample code examples
const examples = [
    `x = 5;
print("Hello, World!");
print("x =", x);`,

    `# Basic arithmetic and variables
x = 5;
y = 10;
result = x + y * 2;
print("Result:", result);

# String operations
name = "World";
print("Hello", name);`,

    `# Conditional statements
x = 15;

if x > 10 {
    print("x is greater than 10");
    print("Value of x:", x);
    } else {
    print("x is not greater than 10");
    }`,

    `# While loops
counter = 1;
print("Counting to 5:");

while counter <= 5 {
    print("Count:", counter);
    counter = counter + 1;
}
print("Done counting!");`,

    `# Complex example
print("=== SPL Demo ===");

# Variables
a = 5;
b = 3;
print("a =", a);
print("b =", b);

# Arithmetic
sum = a + b;
product = a * b;
print("Sum:", sum);
print("Product:", product);

# Conditionals and loops
if sum > 7 {
    print("Sum is greater than 7");
    i = 1;
    while i <= 3{
        print("Loop iteration:", i);
        i = i + 1;
    }
}
print("Program finished!");`
];

// Simple SPL interpreter embedded as string
const splInterpreterCode = `
# Simple Programming Language Interpreter

class SPLError(Exception):
    pass

class Token:
    def __init__(self, type, value, line=1, col=1):
        self.type = type
        self.value = value
        self.line = line
        self.col = col
    
    def __repr__(self):
        return f"Token({self.type}, {self.value})"

class Lexer:
    def __init__(self, text):
        self.text = text
        self.pos = 0
        self.line = 1
        self.col = 1
        
    def tokenize(self):
        tokens = []
        while self.pos < len(self.text):
            if self.current_char() is None:
                break
            elif self.current_char().isspace():
                if self.current_char() == '\\n':
                    tokens.append(Token('NEWLINE', '\\n', self.line, self.col))
                    self.line += 1
                    self.col = 1
                self.advance()
            elif self.current_char() == '#':
                self.skip_comment()
            elif self.current_char().isdigit():
                tokens.append(self.make_number())
            elif self.current_char().isalpha() or self.current_char() == '_':
                tokens.append(self.make_identifier())
            elif self.current_char() == '"':
                tokens.append(self.make_string())
            elif self.current_char() == '+':
                tokens.append(Token('PLUS', '+', self.line, self.col))
                self.advance()
            elif self.current_char() == '-':
                tokens.append(Token('MINUS', '-', self.line, self.col))
                self.advance()
            elif self.current_char() == '*':
                tokens.append(Token('MULTIPLY', '*', self.line, self.col))
                self.advance()
            elif self.current_char() == '/':
                tokens.append(Token('DIVIDE', '/', self.line, self.col))
                self.advance()
            elif self.current_char() == '(':
                tokens.append(Token('LPAREN', '(', self.line, self.col))
                self.advance()
            elif self.current_char() == ')':
                tokens.append(Token('RPAREN', ')', self.line, self.col))
                self.advance()
            elif self.current_char() == '[':
                tokens.append(Token('LBRACKET', '[', self.line, self.col))
                self.advance()
            elif self.current_char() == ']':
                tokens.append(Token('RBRACKET', ']', self.line, self.col))
                self.advance()
            elif self.current_char() == '{':
                tokens.append(Token('LBRACE', '{', self.line, self.col))
                self.advance()
            elif self.current_char() == '}':
                tokens.append(Token('RBRACE', '}', self.line, self.col))
                self.advance()
            elif self.current_char() == '=':
                if self.pos + 1 < len(self.text) and self.text[self.pos + 1] == '=':
                    tokens.append(Token('EQ', '==', self.line, self.col))
                    self.advance()
                    self.advance()
                else:
                    tokens.append(Token('ASSIGN', '=', self.line, self.col))
                    self.advance()
            elif self.current_char() == '>':
                if self.pos + 1 < len(self.text) and self.text[self.pos + 1] == '=':
                    tokens.append(Token('GTE', '>=', self.line, self.col))
                    self.advance()
                    self.advance()
                else:
                    tokens.append(Token('GT', '>', self.line, self.col))
                    self.advance()
            elif self.current_char() == '<':
                if self.pos + 1 < len(self.text) and self.text[self.pos + 1] == '=':
                    tokens.append(Token('LTE', '<=', self.line, self.col))
                    self.advance()
                    self.advance()
                else:
                    tokens.append(Token('LT', '<', self.line, self.col))
                    self.advance()
            elif self.current_char() == '!':
                if self.pos + 1 < len(self.text) and self.text[self.pos + 1] == '=':
                    tokens.append(Token('NEQ', '!=', self.line, self.col))
                    self.advance()
                    self.advance()
                else:
                    raise SPLError(f"Unexpected character: {self.current_char()}")
            elif self.current_char() == ';':
                tokens.append(Token('SEMICOLON', ';', self.line, self.col))
                self.advance()
            elif self.current_char() == ',':
                tokens.append(Token('COMMA', ',', self.line, self.col))
                self.advance()
            else:
                raise SPLError(f"Unexpected character: {self.current_char()}")
        
        tokens.append(Token('EOF', None, self.line, self.col))
        return tokens
    
    def current_char(self):
        if self.pos >= len(self.text):
            return None
        return self.text[self.pos]
    
    def advance(self):
        self.pos += 1
        self.col += 1
    
    def skip_comment(self):
        while self.current_char() and self.current_char() != '\\n':
            self.advance()
    
    def make_number(self):
        start_col = self.col
        num_str = ''
        while self.current_char() and (self.current_char().isdigit() or self.current_char() == '.'):
            num_str += self.current_char()
            self.advance()
        return Token('NUMBER', float(num_str), self.line, start_col)
    
    def make_identifier(self):
        start_col = self.col
        id_str = ''
        while self.current_char() and (self.current_char().isalnum() or self.current_char() == '_'):
            id_str += self.current_char()
            self.advance()
        
        # Check for keywords
        keywords = {
            'if': 'IF',
            'else': 'ELSE',
            'while': 'WHILE',
            'print': 'PRINT',
            'break': 'BREAK',
            'True': 'TRUE',
            'False': 'FALSE',
            'for': 'FOR',
            'in': 'IN',
            'range': 'RANGE'
        }
        token_type = keywords.get(id_str, 'IDENTIFIER')
        return Token(token_type, id_str, self.line, start_col)
    
    def make_string(self):
        start_col = self.col
        self.advance()  # Skip opening quote
        string_val = ''
        while self.current_char() and self.current_char() != '"':
            string_val += self.current_char()
            self.advance()
        
        if self.current_char() == '"':
            self.advance()  # Skip closing quote
        else:
            raise SPLError("Unterminated string")
        
        return Token('STRING', string_val, self.line, start_col)



class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0
    
    def current_token(self):
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return None
    
    def advance(self):
        self.pos += 1
    
    def parse(self):
        statements = []
        while self.current_token() and self.current_token().type != 'EOF':
            if self.current_token().type == 'NEWLINE':
                self.advance()
                continue
            stmt = self.parse_statement()
            if stmt:
                statements.append(stmt)
                if self.current_token() and self.current_token().type == 'SEMICOLON':
                    self.advance()
                elif self.current_token() and self.current_token().type == 'NEWLINE':
                    while self.current_token() and self.current_token().type == 'NEWLINE':
                        self.advance()
                    if (self.current_token() and self.current_token().type not in ['EOF', 'RBRACE', 'ELSE', 'IF', 'WHILE', 'FOR', 'PRINT']):
                        self.expect('SEMICOLON')
                elif not self.current_token() or self.current_token().type == 'EOF':
                    pass
                else:
                    if (self.current_token() and self.current_token().type not in ['RBRACE', 'ELSE', 'EOF']):
                        self.expect('SEMICOLON')

        return {'type': 'Program', 'statements': statements}
    
    def parse_statement(self):
        if not self.current_token():
            return None
        
        token_type = self.current_token().type

        if token_type == 'PRINT':
            return self.parse_print()
        elif token_type == 'IF':
            return self.parse_if()
        elif token_type == 'WHILE':
            return self.parse_while()
        elif token_type == 'FOR':
            return self.parse_for()
        elif token_type == 'BREAK':
            return self.parse_break()
        elif token_type == 'IDENTIFIER':
            return self.parse_assignment()
        else:
            raise SPLError(f"Unexpected token: {token_type}")
    
    def parse_break(self):
        self.advance()
        return {'type': 'Break'}

    def parse_print(self):
        self.advance()  # consume 'print'
        self.expect('LPAREN')
        
        args = []
        if self.current_token() and self.current_token().type != 'RPAREN':
            args.append(self.parse_expression())
            while self.current_token() and self.current_token().type == 'COMMA':
                self.advance()  # consume comma
                args.append(self.parse_expression())
        
        self.expect('RPAREN')
        return {'type': 'Print', 'args': args}
    
    def parse_assignment(self):
        name = self.current_token().value
        self.advance()  # consume identifier
        self.expect('ASSIGN')
        value = self.parse_expression()
        return {'type': 'Assign', 'name': name, 'value': value}
    
    def parse_if(self):
        self.advance()  # consume 'if'
        condition = self.parse_expression()
        
        # Skip newlines
        while self.current_token() and self.current_token().type == 'NEWLINE':
            self.advance()
        
        then_branch = self.parse_block()
        
        else_branch = []
        if self.current_token() and self.current_token().type == 'ELSE':
            self.advance()  # consume 'else'
            
            while self.current_token() and self.current_token().type == 'NEWLINE':
                self.advance()
            
            else_branch = self.parse_block()
        
        return {'type': 'If', 'condition': condition, 'then_branch': then_branch, 'else_branch': else_branch}

    def parse_for(self):
        self.advance()

        if not self.current_token() or self.current_token().type != 'IDENTIFIER':
            raise SPLError("Expected variable name after 'for'")
        var_name = self.current_token().value
        self.advance()

        self.expect('IN')

        iterable = self.parse_expression()

        while self.current_token() and self.current_token().type == 'NEWLINE':
            self.advance()
        
        body = self.parse_block()

        return {
            'type': 'For',
            'var_name': var_name,
            'iterable': iterable,
            'body': body
        }
        
    def parse_while(self):
        self.advance()  # consume 'while'
        condition = self.parse_expression()
        
        while self.current_token() and self.current_token().type == 'NEWLINE':
            self.advance()
        
        body = self.parse_block()
        
        return {'type': 'While', 'condition': condition, 'body': body}
    
    def parse_block(self):
        statements = []
        self.expect('LBRACE')

        while self.current_token() and self.current_token().type != 'RBRACE':
            if self.current_token().type == 'NEWLINE':
                self.advance()
                continue
            
            stmt = self.parse_statement()
            if stmt:
                statements.append(stmt)
                if self.current_token() and self.current_token().type == 'SEMICOLON':
                    self.advance()
                else:
                    next_pos = self.pos
                    while next_pos < len(self.tokens) and self.tokens[next_pos].type == 'NEWLINE':
                        next_pos += 1
                    if next_pos < len(self.tokens) and self.tokens[next_pos].type != 'RBRACE':
                        self.expect('SEMICOLON')
        self.expect('RBRACE')
        return statements


    def parse_expression(self):
        left = self.parse_comparison()
        return left
    
    def parse_comparison(self):
        left = self.parse_term()
        
        while self.current_token() and self.current_token().type in ['GT', 'LT', 'GTE', 'LTE', 'EQ', 'NEQ']:
            op = self.current_token().value
            self.advance()
            right = self.parse_term()
            left = {'type': 'BinOp', 'left': left, 'op': op, 'right': right}
        
        return left
    
    def parse_term(self):
        left = self.parse_factor()
        
        while self.current_token() and self.current_token().type in ['PLUS', 'MINUS']:
            op = self.current_token().value
            self.advance()
            right = self.parse_factor()
            left = {'type': 'BinOp', 'left': left, 'op': op, 'right': right}
        
        return left
    
    def parse_factor(self):
        left = self.parse_primary()
        
        while self.current_token() and self.current_token().type in ['MULTIPLY', 'DIVIDE']:
            op = self.current_token().value
            self.advance()
            right = self.parse_primary()
            left = {'type': 'BinOp', 'left': left, 'op': op, 'right': right}
        
        return left
    
    def parse_primary(self):
        token = self.current_token()
        
        if token.type == 'NUMBER':
            self.advance()
            return {'type': 'Number', 'value': token.value}
        elif token.type == 'STRING':
            self.advance()
            return {'type': 'String', 'value': token.value}
        elif token.type == 'IDENTIFIER':
            name = token.value
            self.advance()

            if self.current_token() and self.current_token().type == 'LBRACKET':
                self.advance()
                index = self.parse_expression()
                self.expect('RBRACKET')
                return {'type': 'Index', 'object': {'type': 'Variable', 'name':name}, 'index': index}
            else:
                return {'type': 'Variable', 'name': name}
        elif token.type == 'LPAREN':
            self.advance()
            expr = self.parse_expression()
            self.expect('RPAREN')
            return expr
        elif token.type == 'MINUS':
            self.advance()
            operand = self.parse_primary()
            return {'type': 'UnaryOp', 'op': '-', 'operand': operand}
        elif token.type == 'TRUE':
            self.advance()
            return {'type': 'Boolean', 'value': True}
        elif token.type == 'FALSE':
            self.advance()
            return {'type': 'Boolean', 'value': False}
        elif token.type == 'LBRACKET':
            self.advance()
            elements = []
            if self.current_token() and self.current_token().type != 'RBRACKET':
                elements.append(self.parse_expression())
                while self.current_token() and self.current_token().type == 'COMMA':
                    self.advance()
                    elements.append(self.parse_expression())
            self.expect('RBRACKET')
            return {'type': 'List', 'elements': elements}
        elif token.type == 'RANGE':
            self.advance()
            self.expect('LPAREN')

            args = []
            if self.current_token() and self.current_token().type != 'RPAREN':
                args.append(self.parse_expression())
                while self.current_token() and self.current_token().type == 'COMMA':
                    self.advance()
                    args.append(self.parse_expression())
            self.expect('RPAREN')
            return {'type': 'Range', 'args': args}
        else:
            raise SPLError(f"Unexpected token: {token.type}")
    
    def expect(self, token_type):
        if self.current_token() and self.current_token().type == token_type:
            self.advance()
        else:
            current = self.current_token().type if self.current_token() else 'EOF'
            raise SPLError(f"Expected {token_type}, got {current}")

class Interpreter:
    def __init__(self):
        self.variables = {}
        self.output = []
    
    def interpret(self, node):
        method_name = f'visit_{node["type"]}'
        method = getattr(self, method_name, self.generic_visit)
        return method(node)
    
    def generic_visit(self, node):
        raise SPLError(f"No visit method for {node['type']}")
    
    def visit_Program(self, node):
        result = None
        for stmt in node['statements']:
            result = self.interpret(stmt)
        return result
    
    def visit_Number(self, node):
        return node['value']

    def visit_Boolean(self, node):
        return node['value']    
    
    def visit_String(self, node):
        return node['value']
    
    def visit_Variable(self, node):
        name = node['name']
        if name in self.variables:
            return self.variables[name]
        else:
            raise SPLError(f"Variable '{name}' is not defined")
    
    def visit_BinOp(self, node):
        left = self.interpret(node['left'])
        right = self.interpret(node['right'])
        op = node['op']
        
        if op == '+':
            return left + right
        elif op == '-':
            return left - right
        elif op == '*':
            return left * right
        elif op == '/':
            if right == 0:
                raise SPLError("Division by zero")
            return left / right
        elif op == '>':
            return left > right
        elif op == '<':
            return left < right
        elif op == '>=':
            return left >= right
        elif op == '<=':
            return left <= right
        elif op == '==':
            return left == right
        elif op == '!=':
            return left != right
        else:
            raise SPLError(f"Unknown operator: {op}")
    
    def visit_UnaryOp(self, node):
        operand = self.interpret(node['operand'])
        if node['op'] == '-':
            return -operand
        else:
            raise SPLError(f"Unknown unary operator: {node['op']}")
    
    def visit_Assign(self, node):
        value = self.interpret(node['value'])
        self.variables[node['name']] = value
        return value
    
    def visit_Print(self, node):
        values = []
        for arg in node['args']:
            value = self.interpret(arg)
            values.append(str(value))
        
        output_text = ' '.join(values)
        self.output.append(output_text)
        return None
    
    def visit_If(self, node):
        condition = self.interpret(node['condition'])
        if condition:
            result = None
            for stmt in node['then_branch']:
                result = self.interpret(stmt)
            return result
        elif node['else_branch']:
            result = None
            for stmt in node['else_branch']:
                result = self.interpret(stmt)
            return result
        return None

    def visit_For(self, node):
        iterable_value = self.interpret(node['iterable'])

        result = None
        try:
            if isinstance(iterable_value, list):
                for item in iterable_value:
                    self.variables[node['var_name']] = item
                    for stmt in node['body']:
                        result = self.interpret(stmt)
            elif isinstance(iterable_value, dict) and iterable_value.get('type') == 'range':
                start = int(iterable_value.get('start', 0))
                end = int(iterable_value.get('end', 0))
                step = int(iterable_value.get('step', 1))
                for i in range(start, end, step):
                    self.variables[node['var_name']] = i
                    for stmt in node['body']:
                        result = self.interpret(stmt)
            else:
                raise SPLError(f"Object is not iterable: {type(iterable_value)}")
        except BreakException:
            pass
        
        return result
    
    def visit_Range(self, node):
        args = [self.interpret(arg) for arg in node['args']]

        if len(args) == 1:
            return {'type': 'range', 'start': 0, 'end': int(args[0]), 'step': 1}
        elif len(args) == 2:
            return {'type': 'range', 'start': int(args[0]), 'end': int(args[1]), 'step': 1}
        elif len(args) == 3:
            return {'type': 'range', 'start': int(args[0]), 'end': int(args[1]), 'step': int(args[2])}
        else:
            raise SPLError('range() takes 1 to 3 arguments')

    def visit_While(self, node):
        result = None
        try:
            while self.interpret(node['condition']):
                for stmt in node['body']:
                    result = self.interpret(stmt)
        except BreakException:
            pass
        return result
    
    def visit_Break(self, node):
        raise BreakException()
    
    def visit_List(self, node):
        elements = []
        for element in node['elements']:
            elements.append(self.interpret(element))
        return elements
    
    def visit_Index(self, node):
        obj = self.interpret(node['object'])
        index = int(self.interpret(node['index']))
        
        if isinstance(obj, list):
            if 0 <= index < len(obj):
                return obj[index]
            else:
                raise SPLError(f"List index out of range: {index}")
        else:
            raise SPLError(f"Object is not indexable: {type(obj)}")

class BreakException(Exception):
    pass

# Global interpreter instance
global_interpreter = Interpreter()

def execute_spl_code(code):
    global global_interpreter
    try:
        # Clear previous output
        global_interpreter.output = []
        
        # Parse and execute
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()
        
        result = global_interpreter.interpret(ast)
        
        return {
            'success': True,
            'output': global_interpreter.output,
            'result': result,
            'error': None
        }
    except Exception as e:
        return {
            'success': False,
            'output': global_interpreter.output,
            'result': None,
            'error': str(e)
        }

print("SPL Interpreter loaded successfully!")
`;

// Initialize Pyodide and the SPL interpreter
async function initializePyodide() {
    try {
        console.log("Loading Pyodide...");
        pyodide = await loadPyodide();
        console.log("Pyodide loaded successfully");
        
        // Load the SPL interpreter
        console.log("Loading SPL interpreter...");
        await pyodide.runPythonAsync(splInterpreterCode);
        console.log("SPL interpreter loaded successfully");
        
        return true;
    } catch (error) {
        console.error("Failed to initialize:", error);
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

// Execute SPL code
async function runCode() {
    const runBtn = document.getElementById('run-btn');
    const output = document.getElementById('output');
    
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
        
        console.log("Executing SPL code:", code);
        
        // Execute the code
        pyodide.globals.set('user_code', code);
        
        const resultStr = pyodide.runPython(`
import json
result = execute_spl_code(user_code)
json.dumps(result)
        `);
        
        const result = JSON.parse(resultStr);
        console.log("SPL execution result:", result);
        
        // Display results
        if (result.error) {
            addOutput(`Error: ${result.error}`, "error");
        } else {
            if (result.output && result.output.length > 0) {
                result.output.forEach(line => {
                    addOutput(line, "print");
                });
            }
            
            if (result.output.length === 0) {
                addOutput("✓ Code executed successfully (no output)", "info");
            }
        }
        
    } catch (error) {
        console.error("JavaScript error:", error);
        addOutput(`JavaScript Error: ${error.message}`, "error");
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
    output.scrollTop = output.scrollHeight;
}

// Clear output
function clearOutput(clearWelcome = true) {
    const output = document.getElementById('output');
    if (clearWelcome) {
        output.innerHTML = '';
    } else {
        // Keep welcome message, remove everything else
        const children = Array.from(output.children);
        children.forEach(child => {
            if (!child.classList.contains('welcome-output')) {
                child.remove();
            }
        });
    }
}

// Load example code
function loadExample() {
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    codeEditor.setValue(randomExample);
    addOutput("Example code loaded!", "info");
}

// Main initialization function
async function main() {
    const status = document.getElementById('status');
    
    try {
        status.textContent = "Loading Pyodide...";
        
        // Initialize Pyodide
        const pyodideLoaded = await initializePyodide();
        if (!pyodideLoaded) {
            throw new Error("Failed to load Pyodide");
        }
        
        status.textContent = "Ready! Write your code and click Run.";
        status.style.color = "#00ff00";
        
        // Enable controls
        document.getElementById('run-btn').disabled = false;
        
        console.log("SPL IDE ready!");
        
    } catch (error) {
        console.error("Initialization failed:", error);
        status.innerHTML = `
            <div style="color: #ff4444;">Error: ${error.message}</div>
            <div style="color: #ffaa00; font-size: 12px; margin-top: 5px;">
                Check browser console for details.
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
