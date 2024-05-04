import GameManager from "../masoi/GameManager.js";
import MasoiGame from "../masoi/index.js";
export default {
  newAll() {
    global.gameManager = new GameManager({ masoi: MasoiGame })
  },
  addGameMasoi() {
    global.gameManager.import({ masoi: MasoiGame })
  }
}