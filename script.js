// Simplified SPL interpreter code - more concise and readable
const splInterpreterCode = `
class SPLError(Exception): pass

class Token:
    def __init__(self, type, value, line=1, col=1):
        self.type, self.value, self.line, self.col = type, value, line, col
    def __repr__(self): return f"Token({self.type}, {self.value})"

class Lexer:
    OPERATORS = {
        '+': 'PLUS', '-': 'MINUS', '*': 'MULTIPLY', '/': 'DIVIDE',
        '(': 'LPAREN', ')': 'RPAREN', '[': 'LBRACKET', ']': 'RBRACKET',
        '{': 'LBRACE', '}': 'RBRACE', ';': 'SEMICOLON', ',': 'COMMA'
    }
    
    KEYWORDS = {
        'if': 'IF', 'else': 'ELSE', 'while': 'WHILE', 'print': 'PRINT',
        'break': 'BREAK', 'True': 'TRUE', 'False': 'FALSE',
        'for': 'FOR', 'in': 'IN', 'range': 'RANGE'
    }
    
    def __init__(self, text):
        self.text = text
        self.pos = 0
        self.line = 1
        self.col = 1
        
    def tokenize(self):
        tokens = []
        while self.pos < len(self.text):
            char = self.current_char()
            if not char: break
            
            if char.isspace():
                if char == '\\n':
                    tokens.append(Token('NEWLINE', '\\n', self.line, self.col))
                    self.line += 1
                    self.col = 1
                self.advance()
            elif char == '#':
                self.skip_comment()
            elif char.isdigit():
                tokens.append(self.make_number())
            elif char.isalpha() or char == '_':
                tokens.append(self.make_identifier())
            elif char == '"':
                tokens.append(self.make_string())
            elif char in self.OPERATORS:
                tokens.append(Token(self.OPERATORS[char], char, self.line, self.col))
                self.advance()
            elif char in '=><!' and self.peek() == '=':
                op_map = {'==': 'EQ', '>=': 'GTE', '<=': 'LTE', '!=': 'NEQ'}
                op = char + self.peek()
                tokens.append(Token(op_map[op], op, self.line, self.col))
                self.advance(2)
            elif char == '=':
                tokens.append(Token('ASSIGN', '=', self.line, self.col))
                self.advance()
            elif char in '><':
                op_map = {'>': 'GT', '<': 'LT'}
                tokens.append(Token(op_map[char], char, self.line, self.col))
                self.advance()
            else:
                raise SPLError(f"Unexpected character: {char}")
        
        tokens.append(Token('EOF', None, self.line, self.col))
        return tokens
    
    def current_char(self):
        return None if self.pos >= len(self.text) else self.text[self.pos]
    
    def peek(self):
        next_pos = self.pos + 1
        return None if next_pos >= len(self.text) else self.text[next_pos]
    
    def advance(self, count=1):
        for _ in range(count):
            if self.pos < len(self.text):
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
        
        token_type = self.KEYWORDS.get(id_str, 'IDENTIFIER')
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
        return self.tokens[self.pos] if self.pos < len(self.tokens) else None
    
    def advance(self): self.pos += 1
    
    def parse(self):
        statements = []
        while self.current_token() and self.current_token().type != 'EOF':
            if self.current_token().type == 'NEWLINE':
                self.advance()
                continue
            stmt = self.parse_statement()
            if stmt:
                statements.append(stmt)
                self._handle_statement_separator()
        return {'type': 'Program', 'statements': statements}
    
    def _handle_statement_separator(self):
        """Handle semicolons and newlines after statements"""
        if self.current_token() and self.current_token().type == 'SEMICOLON':
            self.advance()
        elif self.current_token() and self.current_token().type == 'NEWLINE':
            while self.current_token() and self.current_token().type == 'NEWLINE':
                self.advance()
            if (self.current_token() and 
                self.current_token().type not in ['EOF', 'RBRACE', 'ELSE', 'IF', 'WHILE', 'FOR', 'PRINT']):
                self.expect('SEMICOLON')
        elif not self.current_token() or self.current_token().type == 'EOF':
            pass
        else:
            if (self.current_token() and 
                self.current_token().type not in ['RBRACE', 'ELSE', 'EOF']):
                self.expect('SEMICOLON')
    
    def parse_statement(self):
        if not self.current_token(): return None
        
        token_type = self.current_token().type
        parsers = {
            'PRINT': self.parse_print,
            'IF': self.parse_if,
            'WHILE': self.parse_while,
            'FOR': self.parse_for,
            'BREAK': self.parse_break,
            'IDENTIFIER': self.parse_assignment
        }
        
        if token_type in parsers:
            return parsers[token_type]()
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
        self._skip_newlines()
        then_branch = self.parse_block()
        
        else_branch = []
        if self.current_token() and self.current_token().type == 'ELSE':
            self.advance()  # consume 'else'
            self._skip_newlines()
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
        self._skip_newlines()
        body = self.parse_block()

        return {'type': 'For', 'var_name': var_name, 'iterable': iterable, 'body': body}
        
    def parse_while(self):
        self.advance()  # consume 'while'
        condition = self.parse_expression()
        self._skip_newlines()
        body = self.parse_block()
        return {'type': 'While', 'condition': condition, 'body': body}
    
    def _skip_newlines(self):
        """Helper to skip newline tokens"""
        while self.current_token() and self.current_token().type == 'NEWLINE':
            self.advance()
    
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

    def parse_expression(self): return self.parse_comparison()
    
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
        
        simple_types = {
            'NUMBER': lambda: {'type': 'Number', 'value': token.value},
            'STRING': lambda: {'type': 'String', 'value': token.value},
            'TRUE': lambda: {'type': 'Boolean', 'value': True},
            'FALSE': lambda: {'type': 'Boolean', 'value': False}
        }
        
        if token.type in simple_types:
            self.advance()
            return simple_types[token.type]()
        elif token.type == 'IDENTIFIER':
            name = token.value
            self.advance()
            if self.current_token() and self.current_token().type == 'LBRACKET':
                self.advance()
                index = self.parse_expression()
                self.expect('RBRACKET')
                return {'type': 'Index', 'object': {'type': 'Variable', 'name': name}, 'index': index}
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
    
    def visit_Number(self, node): return node['value']
    def visit_Boolean(self, node): return node['value']
    def visit_String(self, node): return node['value']
    
    def visit_Break(self, node): raise BreakException()
    
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
        
        if op == '/' and right == 0:
            raise SPLError(Division by zero")

        ops = {
            '+': left + right,
            '-':  left - right,
            '*': left * right,
            '/': left / right,
            '>': left > right,
            '<': left < right,
            '>=': left >= right,
            '<=': left <= right,
            '==': left == right,
            '!=': left != right
        }
        
        if op in ops:
            return ops[op](left, right)
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
        values = [str(self.interpret(arg)) for arg in node['args']]
        output_text = ' '.join(values)
        self.output.append(output_text)
        return None
    
    def visit_If(self, node):
        condition = self.interpret(node['condition'])
        if condition:
            return self._execute_statements(node['then_branch'])
        elif node['else_branch']:
            return self._execute_statements(node['else_branch'])
        return None

    def visit_For(self, node):
        iterable_value = self.interpret(node['iterable'])
        result = None
        try:
            if isinstance(iterable_value, list):
                for item in iterable_value:
                    self.variables[node['var_name']] = item
                    result = self._execute_statements(node['body'])
            elif isinstance(iterable_value, dict) and iterable_value.get('type') == 'range':
                start = int(iterable_value.get('start', 0))
                end = int(iterable_value.get('end', 0))
                step = int(iterable_value.get('step', 1))
                for i in range(start, end, step):
                    self.variables[node['var_name']] = i
                    result = self._execute_statements(node['body'])
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
                result = self._execute_statements(node['body'])
        except BreakException:
            pass
        return result
    
    def visit_List(self, node):
        return [self.interpret(element) for element in node['elements']]
    
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
    
    def _execute_statements(self, statements):
        result = None
        for stmt in statements:
            result = self.interpret(stmt)
        return result

class BreakException(Exception): pass

# Global interpreter instance
global_interpreter = Interpreter()

def execute_spl_code(code):
    global global_interpreter
    try:
        global_interpreter.output = []  # Clear previous output
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

// Global variables
let pyodide, codeEditor;

// Sample code examples - more concise examples
const examples = [
    `x = 5;\nprint("Hello, World!");\nprint("x =", x);`,
    
    `# Basic arithmetic\nx = 5; y = 10;\nresult = x + y * 2;\nprint("Result:", result);\n\nname = "World";\nprint("Hello", name);`,
    
    `# Conditionals\nx = 15;\nif x > 10 {\n    print("x is greater than 10");\n} else {\n    print("x is not greater than 10");\n}`,
    
    `# Loops\ncounter = 1;\nwhile counter <= 5 {\n    print("Count:", counter);\n    counter = counter + 1;\n}`,
    
    `# Lists and for loops\nnumbers = [1, 2, 3, 4, 5];\nfor num in numbers {\n    print("Number:", num);\n}\n\nfor i in range(3) {\n    print("Range:", i);\n}`
];

// Initialize Pyodide and SPL interpreter
async function initializePyodide() {
    try {
        console.log("Loading Pyodide...");
        pyodide = await loadPyodide();
        console.log("Pyodide loaded, loading SPL interpreter...");
        await pyodide.runPythonAsync(splInterpreterCode);
        console.log("SPL interpreter loaded successfully");
        return true;
    } catch (error) {
        console.error("Failed to initialize:", error);
        return false;
    }
}

// Initialize CodeMirror editor
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
    codeEditor.setValue(examples[0]);
}

// Execute SPL code with improved error handling
async function runCode() {
    const runBtn = document.getElementById('run-btn');
    const code = codeEditor.getValue().trim();
    
    if (!code) {
        addOutput("No code to execute!", "error");
        return;
    }
    
    try {
        // Update UI
        runBtn.disabled = true;
        runBtn.innerHTML = '<span class="btn-icon">⏳</span>Running...';
        
        // Clear output and show running message
        clearOutput(false);
        addOutput(`> Running code...`, "info");
        
        // Execute code via Pyodide
        pyodide.globals.set('user_code', code);
        const resultStr = pyodide.runPython(`
import json
result = execute_spl_code(user_code)
json.dumps(result)
        `);
        
        const result = JSON.parse(resultStr);
        
        // Display results
        if (result.error) {
            addOutput(`Error: ${result.error}`, "error");
        } else {
            if (result.output?.length > 0) {
                result.output.forEach(line => addOutput(line, "print"));
            } else {
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

// Utility functions for output management
function addOutput(text, type = "output") {
    const output = document.getElementById('output');
    const div = document.createElement('div');
    
    const classMap = {
        "error": "error-line",
        "print": "print-line", 
        "info": "output-line",
        "output": "output-line"
    };
    
    div.className = classMap[type] || "output-line";
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function clearOutput(clearWelcome = true) {
    const output = document.getElementById('output');
    if (clearWelcome) {
        output.innerHTML = '';
    } else {
        // Keep welcome message, remove everything else
        Array.from(output.children).forEach(child => {
            if (!child.classList.contains('welcome-output')) {
                child.remove();
            }
        });
    }
}

function loadExample() {
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    codeEditor.setValue(randomExample);
    addOutput("Example code loaded!", "info");
}

// Main initialization
async function main() {
    const status = document.getElementById('status');
    
    try {
        status.textContent = "Loading Pyodide...";
        
        const pyodideLoaded = await initializePyodide();
        if (!pyodideLoaded) {
            throw new Error("Failed to load Pyodide");
        }
        
        status.textContent = "Ready! Write your code and click Run.";
        status.style.color = "#00ff00";
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

// Event listeners setup
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    
    // Button events
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
    
    main();
});
