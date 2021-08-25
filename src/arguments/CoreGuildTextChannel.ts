import type { PieceContext } from '@sapphire/pieces';
import type { TextChannel } from 'discord.js';
import { Identifiers } from '../lib/errors/Identifiers';
import { resolveGuildTextChannel } from '../lib/resolvers';
import { Argument, ArgumentContext, ArgumentResult } from '../lib/structures/Argument';

export class CoreArgument extends Argument<TextChannel> {
	public constructor(context: PieceContext) {
		super(context, { name: 'guildTextChannel' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<TextChannel> {
		const { guild } = context.message;
		if (!guild) {
			return this.error({
				parameter,
				identifier: Identifiers.ArgumentGuildChannelMissingGuildError,
				message: 'This command can only be used in a server.',
				context
			});
		}

		const resolved = resolveGuildTextChannel(parameter, guild);
		if (resolved.success) return this.ok(resolved.value);
		return this.error({
			parameter,
			identifier: resolved.error,
			message: 'The given argument did not resolve to a valid text channel.',
			context: { ...context, guild }
		});
	}
}