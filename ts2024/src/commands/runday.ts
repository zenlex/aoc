import {Args, Command, Flags} from '@oclif/core'

export default class Runday extends Command {
  static override args = {
    day: Args.integer({min:1, max:25, description: 'day to run(1-25)'}),
  }

  static override description = 'runs a days solution'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    part: Flags.integer({min: 1, max:2, description:'part to run(1-2)', char:'p'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Runday)

    const filename = `../d${args.day}.js`
    const {main} = await import(filename);
    if (flags.part) {
      main(flags.part);
    }else{
      main();
    }
  }
}
