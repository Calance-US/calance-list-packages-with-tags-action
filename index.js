const core = require('@actions/core');
const github = require('@actions/github');

const list_packages_with_tags = async () => {
    try{
        let versioned_packages = []
        let packages_array = core.getInput('image_name', { required: true })
        packages_array = packages_array.split(",").map(x => x.trim())
        const token = core.getInput('IMAGE_CLEANUP_TOKEN', { required: true })
        const github = new github.getOctokit(token)
        const package_type = core.getInput('package_type', { required: true })
        const organization = core.getInput('organization', { required: true })
    
        for(let i=0;i<packages_array.length;i++)
        {
            resp1 = await github.request('GET /orgs/{organization}/packages/{package_type}/{package_name}/versions',{
                package_name: packages_array[i],
                package_type: package_type,
                organization: organization
            })
            resp2=resp1.data.map(data=>data.metadata)
            for(j=0;j<resp2.length;j++)
            {
                tags=resp2[j].container.tags
                if(tags==[])
                {
                    continue
                }
                else
                {
                    for(k=0;k<tags.length;k++)
                    {
                        versioned_packages.push(packages_array[i].concat(":",tags[k]))
                    }
                }
            }
        }
        console.log(versioned_packages)
        core.setOutput("packages-with-tags",versioned_packages)
        
    } catch (error) {
        core.setFailed(error.message)
      }
    
}
list_packages_with_tags()
