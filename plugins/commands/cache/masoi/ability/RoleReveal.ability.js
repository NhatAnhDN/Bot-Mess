import { validIndex, notSelf } from '../format/index.js';
import Ability from './Ability.js';

export default class RoleReveal extends Ability {
	static question(player) {
		return (
			'• Bạn muốn xem vai trò của ai trong danh sách:\n' +
			player.world.game.listPlayer()
		);
	}

	static check(player, value) {
		const index = player.format(value, validIndex, notSelf);
		player.sendMessage(
			`• Bạn đã chọn xem vai trò của người chơi ${player.world.items[index].name}!`
		);
		return index;
	}

	static async nightend(player, index) {
		if (index == null) return;
		const target = player.world.items[index];
		await player.sendMessage(
			`• Vai trò của ${target.name} là ${target.role.name}`
		);
	}
};
