const formEl = document.getElementById('scrum-form')
const generator = document.getElementById('generator')
const generateBlock = document.getElementById('btn-generate')
const jsonPlaceholder = document.getElementById('json')
const copyBtn = document.getElementById('copy')

const block = num => `
    <div class="form-group">
        <div id="label_${num}" class="p-1 m-1" contentEditable="true">Key-${num}</div>
        <input id="input_${num}" type="text" class="form-control" aria-describedby="Name" placeholder="Value for key-${num}">
    </div>
`

let blocks = [block(0), block(1)]

blocks.forEach(block => {
    generator.innerHTML += block
})

generateBlock.addEventListener('click', event => {
    blocks.push(block(blocks.length))
    generator.innerHTML += block(blocks.length - 1)
})




let form = {}

formEl.addEventListener('submit', event => {
    event.preventDefault()
    const blocksAll = generator.children

    for (let i = 0; i < blocksAll.length; i++) {
        let key, value;
        for (let j = 0; j < blocksAll[i].children.length; j++) {
            // console.log(blocksAll[i].children[j].getAttribute('id'))
            if (j % 2 === 0) {
                key = blocksAll[i].children[j].getAttribute('id')
            } else {
                value = blocksAll[i].children[j].value
            }            
        }
        form[key] = value
    }

    const formJSON = JSON.stringify(form)
    jsonPlaceholder.value = formJSON

    copyBtn.disabled = false
})

copyBtn.addEventListener('click', () => {
    jsonPlaceholder.select()
    jsonPlaceholder.setSelectionRange(0, 99999)
    document.execCommand('copy')
    copyBtn.textContent = 'COPIED!'
    setTimeout(() => {
        copyBtn.textContent = 'COPY JSON'
    }, 2000)
})
