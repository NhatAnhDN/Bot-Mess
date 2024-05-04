import { validIndex, alive, notSelf } from '../format/index.js';
import Ability from './Ability.js';

export default class Kill extends Ability {
	static question(player) {
		return (
			'• Bạn muốn giết ai trong danh sách:\n' + player.world.game.listPlayer({died: false})
		)
	}

	static check(player, value) {
		const index = player.format(
			value,
			validIndex,
			alive,
			notSelf
		);
		const {name} = player.world.items[index];
		player.sendMessage(`• Bạn đã chọn giết ${name}!`);
		return index;
	}

	static async nightend(index) {
		if (index == null) return;
		return index;
	}
};
