const status = (checks, statusInfo): object => {
  const started_at = new Date()

  async function error(): Promise<void> {
    await checks.create({
      ...statusInfo,
      status: 'completed',
      started_at,
      completed_at: new Date(),
      conclusion: 'action_required',
      details_url: 'https://trunkbaseddevelopment.com/',
      output: {
        title: 'So many changes deserve multiple PR\'s',
        summary: `
        Did you know?
        Making huge pull requests slows down project in multiple ways.
        1. Blocks others from working on these parts of the codebase
        2. Increases friction in the team, since more coordination is necessary
        3. Lowers teams agility and makes it more difficult to tackle incoming challenges

        These, and many more, are reasons why you should keep your PR's smol!
        `,
        images: [
          {
            image_url: 'https://i.imgur.com/hd018EV.gif',
            alt: 'See, it does not work'
          }
        ]
      }
    })
  }

  async function warning(): Promise<void> {
    return checks.create({
      ...statusInfo,
      status: 'completed',
      started_at,
      completed_at: new Date(),
      conclusion: 'neutral',
      output: {
        title: 'This is gettin\' chunky',
        summary: `
        Consider refactoring this into multiple PR's.
        `
      }
    })
  }

  async function success(): Promise<void> {
    return checks.create({
      ...statusInfo,
      status: 'completed',
      started_at,
      completed_at: new Date(),
      conclusion: 'success',
      output: {
        title: 'Perfectly fun-sized',
        summary: 'Line by line getting to the finish line.',
        images: [
          {
            image_url: 'https://i.imgur.com/fTTFaHN.gif',
            alt: 'Gotta go fast'
          }
        ]
      }
    })
  }

  return {
    error,
    warning,
    success
  }
}

export default status
