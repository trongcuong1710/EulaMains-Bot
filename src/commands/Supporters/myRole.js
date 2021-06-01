const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const roles = require('../../Constants/roles.json');

class MyRoleCommand extends Command {
  constructor() {
    super('myrole', {
      aliases: ['myrole'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      description: {
        description:
          'Create a custom role for yourself if you are a nitro booster.',
        usage: 'myrole <role name>',
      },
      args: [
        {
          id: 'roleName',
          type: 'string',
          match: 'text',
        },
        {
          id: 'name',
          match: 'flag',
          flag: '--name',
        },
        {
          id: 'newName',
          type: 'string',
          match: 'text',
        },
        {
          id: 'color',
          match: 'flag',
          flag: '--color',
        },
        {
          id: 'newColor',
          type: 'string',
          match: 'text',
        },
      ],
    });
  }

  async exec(message, args) {
    const prefix = this.client.commandHandler.prefix;
    const parentRole = '821776444752527442';
    const customRoles = await this.client.db.eulaCustomRoles.find({
      roleOwner: message.author.id,
    });
    const role = message.guild.roles.cache.get(
      customRoles.map((x) => x.roleID).join('\n')
    );

    if (args.name) {
      if (!role)
        return message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `You don't have a custom role.`,
            fields: [
              {
                name: 'Make One!',
                value: `${prefix + this.id} <role name>`,
              },
            ],
          })
        );
      if (!args.newName)
        return await role
          .setName(`${message.member.user.username}'s Custom Role`)
          .then((updated) =>
            message.channel.send(
              new Discord.MessageEmbed({
                color: role.color,
                description: `Your role name has been reset to ${updated.name}!`,
              })
            )
          );
      return await role
        .setName(args.newName)
        .then((updated) =>
          message.channel.send(
            new Discord.MessageEmbed({
              color: role.color,
              description: `Your role name has been updated!`,
              fields: [
                { name: 'Old Name', value: role.name, inline: true },
                { name: 'New Name', value: updated.name, inline: true },
              ],
            })
          )
        )
        .catch(
          async (e) =>
            await message.channel.send(
              new Discord.MessageEmbed({
                color: 'RED',
                description: e.message,
              })
            )
        );
    }

    if (args.color) {
      if (!role)
        return message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `You don't have a custom role.`,
            fields: [
              {
                name: 'Make One!',
                value: `${prefix + this.id} <role name>`,
              },
            ],
          })
        );
      if (!args.newColor)
        return await role.setColor('000000').then((updated) =>
          message.channel.send(
            new Discord.MessageEmbed({
              color: updated.color,
              description: `Your role color has been reset to default!`,
            })
          )
        );
      return await role
        .setColor(args.newColor)
        .then((updated) =>
          message.channel.send(
            new Discord.MessageEmbed({
              color: updated.color,
              description: `Your role name has been updated!`,
              fields: [
                { name: 'Old Color', value: role.color, inline: true },
                { name: 'New Color', value: updated.color, inline: true },
              ],
            })
          )
        )
        .catch(
          async (e) =>
            await message.channel.send(
              new Discord.MessageEmbed({
                color: 'RED',
                description: e.message,
              })
            )
        );
    }

    if (!args.roleName) {
      if (!role)
        return message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `You don't have a custom role.`,
            fields: [
              {
                name: 'Make One!',
                value: `${prefix + this.id} <role name>`,
              },
            ],
          })
        );
      if (
        await this.client.db.eulaCustomRoles.findOne({
          roleOwner: message.member.id,
        })
      )
        return message.channel.send(
          new Discord.MessageEmbed({
            color: role.color,
            fields: [
              {
                name: `Your Role's Name`,
                value: `${role.name}`,
                inline: true,
              },
              {
                name: `Your Role's Color`,
                value: `${role.color}`,
                inline: true,
              },
              {
                name: 'Edit Your Role Name',
                value: `${prefix}myrole --name <new name>`,
              },
              {
                name: 'Edit Your Role Color',
                value: `${prefix}myrole --color <new color>`,
              },
            ],
          })
        );
    } else {
      if (message.member.roles.cache.has(roles.nitroBoosterRole)) {
        if (
          !(await this.client.db.eulaCustomRoles.findOne({
            roleOwner: message.member.id,
          }))
        )
          await this.client.db.eulaCustomRoles
            .create({
              roleOwner: message.member.id,
            })
            .then(async () => {
              await message.guild.roles
                .create({
                  data: {
                    name: args.roleName,
                    color: 0,
                    hoist: false,
                    position: parentRole.position,
                    mentionable: false,
                  },
                  reason: `Custom role for Nitro Booster: ${message.member.user.username}.`,
                })
                .then(async (role) => {
                  const filter = { roleOwner: message.member.id };
                  const update = { roleID: role.id };
                  await this.client.db.eulaCustomRoles.findOneAndUpdate(
                    filter,
                    update
                  );
                  await role.setPosition(
                    global.guild.roles.cache.get(parentRole).position - 1
                  );
                  await message.member.roles.add(role.id);
                  message.channel.send(
                    new Discord.MessageEmbed({
                      color: role.color,
                      description: `Successfully prepared and assigned your custom role to you!`,
                      fields: [
                        {
                          name: 'Role Name',
                          value: role.name,
                          inline: true,
                        },
                        {
                          name: 'Role Color',
                          value: role.color,
                          inline: true,
                        },
                        {
                          name: 'Edit Role Name',
                          value: `${prefix}myrole --name <new name>`,
                        },
                        {
                          name: 'Edit Role Color',
                          value: `${prefix}myrole --color <new color>`,
                        },
                      ],
                    })
                  );
                });
            });
      } else
        return message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `Sorry but only nitro boosters can have a custom role.`,
          })
        );
    }
  }
}

module.exports = MyRoleCommand;
