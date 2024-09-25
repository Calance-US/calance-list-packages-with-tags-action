const core = require('@actions/core')
const Github = require('@actions/github')

const listPackagesWithTags = async () => {
  try {
    const versionedPackages = []
    let packagesArray = core.getInput('image_name', { required: true })
    packagesArray = packagesArray.replaceAll('\'', '')
    packagesArray = packagesArray.split(',').map(x => x.trim())
    const token = core.getInput('GET_PACKAGES_TOKEN', { required: true })
    const github = Github.getOctokit(token)
    const packageType = core.getInput('package_type', { required: true })
    const organization = core.getInput('organization', { required: true })

    for (let i = 0; i < packagesArray.length; i++) {
      const resp1 = await github.request('GET /orgs/{organization}/packages/{packageType}/{packageName}/versions', {
        packageName: packagesArray[i],
        packageType,
        organization
      })
      const resp2 = resp1.data.map(data => data.metadata)
      for (let j = 0; j < resp2.length; j++) {
        const tags = resp2[j].container.tags
        if (tags.length === 0) {
          continue
        } else {
          for (let k = 0; k < tags.length; k++) {
            versionedPackages.push(packagesArray[i].concat(':', tags[k]))
          }
        }
      }
    }
    console.log(versionedPackages)
    core.setOutput('packages-with-tags', versionedPackages)
  } catch (error) {
    core.setFailed(error.message)
  }
}
listPackagesWithTags()
