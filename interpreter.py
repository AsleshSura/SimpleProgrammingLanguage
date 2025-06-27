from AST import *

class Interpreter:
    def __init__(self):
        self.variables = {}

    def visit(self, node):
        method_name = f'visit_{node.__class__.__name}'
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
        return float(node.value)
    
    def visit_String(self, node):
        return node.value
    
    def visit_Variable(self, node):
        if node.name in self.variables:
            return self.variables[node.name]
        else:
            raise NameError(f"Variable '{node.name}' is not defined")
        
    def visit_BinOp(self, node):
        left = self.visit(node.left)
        right = self.visit(node.right)

        if node.op == "+":
            return left + right
        elif node.op == "-":
            return left - right
        elif node.op == "*":
            return left*right
        elif node.op =="/":
            if right == 0:
                raise ZeroDivisionError("Division by zero")
            return left/right
        elif node.op == '>':
            return left > right
        elif node.op == '<':
            return left < right
        else:
            raise Exception(f"Unkwown binary operator: {node.op}")
    
    def visit_UnaryOp(self, node):
        operand = self.visit(node.opeand)

        if node.op == '-':
            return -operand
        else:
            raise Exception(f"Unkwown unary operator: {node.op}")
    
    def visit_Assign(self, node):
        value = self.visit(node.value)
        self.variables[node.name] = value
        return value
    
    def visit_Print(self, node):
        value = self.visit(node.expr)
        print(value)
        return value
    
    def visit_If(self, node):
        condition = self.visit(node.condition)

        if condition:
            result = None
            for statement in node.then_branch:
                result = self.visit(statement)
                return result
        elif node.else_branch:
            result = None
            for statement in node.else_branch:
                result = self.visit(statement)
                return result
        
        return None
    
    def visit_While(self, node):
        result = None
        while self.visit(node.condition):
            for statement in node.body:
                result = self.visit(statement)
        return result
    
def interpret(code):
    from parser import parse
    ast = parser(code)
    interpreter = Interpreter()
    return interpreter.vist(ast)