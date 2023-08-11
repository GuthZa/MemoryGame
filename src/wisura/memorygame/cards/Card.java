package wisura.memorygame.cards;

public class Card {
    private final String character;
    private boolean shown;

    private int row;
    private int col;

    public Card(String character) {
        this.character = character;
        this.shown = false;
    }

    public Card getByPos(int row, int col) {
        return (row == this.row && col == this.col) ? this : null;
    }

    public String getCharacter() {
//        return this.character;
        return isShown() ? this.character : " ";
    }

    public boolean isShown() {
        return this.shown;
    }

    public void setShown(boolean set) {
        this.shown = set;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getCol() {
        return col;
    }

    public void setCol(int col) {
        this.col = col;
    }

    public String toString() {
        return "Row: " + row + "\tCol: " + col + "\tChar: " + character;
    }
}
