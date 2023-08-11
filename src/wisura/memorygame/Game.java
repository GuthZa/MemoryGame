package wisura.memorygame;


import wisura.memorygame.cards.Card;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.atomic.AtomicReference;

public class Game {

    private static final int BOARD_SIZE = 4;
    private int points = 0;
    List<Card> cards = new ArrayList<>();

    public Game() {
        setupGame();
        gameStart();
    }
    public void setupGame() {
        addSetOfCard();
        addSetOfCard();
        Collections.shuffle(cards);

        int row = 1;
        int col = 1;
        for (Card card : cards) {
            card.setRow(row);
            card.setCol(col);
            col++;
            if(col > BOARD_SIZE) {
                row++;
                col = 1;
            }
        }
    }

    public void gameStart() {

        Scanner sc = new Scanner(System.in);

        boolean game = true;

        AtomicReference<Card> firstChoice = new AtomicReference<>();
        do {
            cards.forEach(card -> {
                if (card.getCol() == 4) {
                    System.out.println(card.getCharacter());
                } else {
                    System.out.print(card.getCharacter() + " | ");
                }
            });

            int row, col;
            System.out.println("Row (1-4): ");
            row = sc.nextInt();
            sc.nextLine();

            System.out.println("Col (1-4): ");
            col = sc.nextInt();
            sc.nextLine();

            System.out.println("\nPoints: " + points);

            if(row == 0 || col == 0) game = false;

            cards.forEach(card -> {
                if (card.getByPos(row, col) != null) {
                    card.getByPos(row, col).setShown(true);

                    if(firstChoice.get() != null) {
                        if(firstChoice.get().getCharacter().equals(card.getCharacter())) {
                            points++;
                        }
                    }else {
                        firstChoice.set(card);
                    }
//                System.out.println(card.getByPos(row, col).getCharacter());
                }
            });

        } while (game);
    }

    public void addSetOfCard() {
        cards.add(new Card("$"));
        cards.add(new Card("#"));
        cards.add(new Card("@"));
        cards.add(new Card("%"));
        cards.add(new Card("&"));
        cards.add(new Card("!"));
        cards.add(new Card("+"));
        cards.add(new Card("="));
    }
}
