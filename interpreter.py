from AST import *
from parser import parse

class OutputHandler:
    def __init__(self):
        self.output = []
    
    def write(self, text):
        self.output.append(str(text))
    
    def get_output(self):
        return self.output
    
    def clear(self):
        self.output = []

class Interpreter:
    def __init__(self):
        self.variables = {}
        self.output_handler = OutputHandler()

    def visit(self, node):
        method_name = f'visit_{node.__class__.__name__}'
        method = getattr(self, method_name, self.generic_visit)
        return method(node)

    def generic_visit(self, node):
        raise Exception(f"No visit method for {node.__class__.__name__}")

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
        if node.name in self.variables:
            return self.variables[node.name]
        else:
            raise NameError(f"Variable '{node.name}' is not defined")
        
    def visit_BinaryOp(self, node):
        left = self.visit(node.left)
        right = self.visit(node.right)

        if node.operator.type.value == "PLUS":
            if isinstance(left, str) or isinstance(right, str):
                return str(left) + str(right)
            return left + right
        elif node.operator.type.value == "MINUS":
            return left - right
        elif node.operator.type.value == "MULTIPLY":
            return left * right
        elif node.operator.type.value == "DIVIDE":
            if right == 0:
                raise ZeroDivisionError("Division by zero")
            return left / right
        elif node.operator.type.value == "GREATER":
            return left > right
        elif node.operator.type.value == "LESS":
            return left < right
        else:
            raise Exception(f"Unknown binary operator: {node.operator.type}")
    
    def visit_UnaryOp(self, node):
        operand = self.visit(node.operand)

        if node.operator.type.value == "MINUS":
            return -operand
        elif node.operator.type.value == "PLUS":
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

def interpret(code):
    ast = parse(code)
    interpreter = Interpreter()
    return interpreter.visit(ast)