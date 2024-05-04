import { validIndex, alive, notSelf } from '../format/index.js';
import Ability from './Ability.js';

export default class VoteLynch extends Ability {
	static question(player) {
		return (
			'• Vui lòng chọn 1 trong mấy người chơi dưới đây để vote treo cổ\n' +
			player.world.game.listPlayer({died: false})
		);
	}

	static check(player, value) {
		const index = player.format(
			value,
			validIndex,
			alive,
			notSelf
		);
		player.sendMessage(
			`• Bạn đã vote treo cổ ${player.world.items[index].name}!`
		);
		return index;
	}

	static async nightend() {}
};
