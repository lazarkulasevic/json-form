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

    const label_0 = document.getElementById('label_0')
    const input_0 = document.getElementById('input_0')

    const label_1 = document.getElementById('label_1')
    const input_1 = document.getElementById('input_1')
})




let form = {}

formEl.addEventListener('submit', event => {
    event.preventDefault()

    // for (let formGroup of generator.children) {
    //     for (let elem of formGroup.children) {
    //         console.log(elem, j)
    //     }
    // }

    const blocksAll = generator.children

    for (let i = 0; i < blocksAll.length; i++) {
        for (let j = 0; j < blocksAll[i].children.length; j++) {
            console.log(blocksAll[i].children[j])
        }
    }

    let form = {
        label_0: input_0.value,
        label_1: input_1.value,
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
