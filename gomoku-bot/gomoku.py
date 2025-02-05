import sys
import random
from PyQt6.QtWidgets import QApplication, QWidget, QPushButton, QGridLayout
from PyQt6.QtCore import Qt

BOARD_SIZE = 10  # 10x10の五目並べ
EMPTY, PLAYER, CPU = 0, 1, 2

class Gomoku(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()
        self.board = [[EMPTY] * BOARD_SIZE for _ in range(BOARD_SIZE)]
        self.current_turn = PLAYER

    def initUI(self):
        self.setWindowTitle("五目並べ")
        self.setGeometry(100, 100, 500, 500)
        self.layout = QGridLayout()
        self.buttons = [[QPushButton(" ") for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
        
        for i in range(BOARD_SIZE):
            for j in range(BOARD_SIZE):
                btn = self.buttons[i][j]
                btn.setFixedSize(40, 40)
                btn.clicked.connect(lambda _, x=i, y=j: self.make_move(x, y))
                self.layout.addWidget(btn, i, j)
        
        self.setLayout(self.layout)
    
    def make_move(self, x, y):
        if self.board[x][y] == EMPTY and self.current_turn == PLAYER:
            self.board[x][y] = PLAYER
            self.buttons[x][y].setText("X")
            self.current_turn = CPU
            if not self.check_win(PLAYER):
                self.cpu_move()
    
    def cpu_move(self):
        best_move = self.find_best_move()
        if best_move:
            x, y = best_move
            self.board[x][y] = CPU
            self.buttons[x][y].setText("O")
            self.current_turn = PLAYER
            self.check_win(CPU)
    
    def find_best_move(self):
        def count_sequence(x, y, dx, dy, player):
            count = 0
            for _ in range(4):
                x += dx
                y += dy
                if 0 <= x < BOARD_SIZE and 0 <= y < BOARD_SIZE and self.board[x][y] == player:
                    count += 1
                else:
                    break
            return count
        
        best_move = None
        highest_priority = -1
        
        for i in range(BOARD_SIZE):
            for j in range(BOARD_SIZE):
                if self.board[i][j] == EMPTY:
                    for dx, dy in [(1, 0), (0, 1), (1, 1), (1, -1)]:
                        cpu_score = count_sequence(i, j, dx, dy, CPU)
                        player_score = count_sequence(i, j, dx, dy, PLAYER)
                        
                        # 相手の4連続を防ぐ（両側を埋める）
                        if player_score == 4:
                            return (i, j)
                        
                        # 相手の4連続が両端開いている場合を防ぐ
                        if 0 <= i - dx < BOARD_SIZE and 0 <= j - dy < BOARD_SIZE and self.board[i - dx][j - dy] == EMPTY:
                            if player_score == 3 and 0 <= i + 4 * dx < BOARD_SIZE and 0 <= j + 4 * dy < BOARD_SIZE and self.board[i + 4 * dx][j + 4 * dy] == EMPTY:
                                return (i, j)
                        
                        priority = max(cpu_score, player_score)
                        if priority > highest_priority:
                            highest_priority = priority
                            best_move = (i, j)
        
        return best_move if best_move else random.choice([(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if self.board[i][j] == EMPTY])
    
    def check_win(self, player):
        def check_line(start_x, start_y, dx, dy):
            count = 0
            for _ in range(5):
                if 0 <= start_x < BOARD_SIZE and 0 <= start_y < BOARD_SIZE and self.board[start_x][start_y] == player:
                    count += 1
                    start_x += dx
                    start_y += dy
                else:
                    break
            return count == 5
        
        for i in range(BOARD_SIZE):
            for j in range(BOARD_SIZE):
                if any(check_line(i, j, dx, dy) for dx, dy in [(1, 0), (0, 1), (1, 1), (1, -1)]):
                    self.end_game(player)
                    return True
        return False
    
    def end_game(self, winner):
        message = "プレイヤーの勝ち！" if winner == PLAYER else "CPUの勝ち！"
        print(message)
        for i in range(BOARD_SIZE):
            for j in range(BOARD_SIZE):
                self.buttons[i][j].setEnabled(False)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    game = Gomoku()
    game.show()
    sys.exit(app.exec())
