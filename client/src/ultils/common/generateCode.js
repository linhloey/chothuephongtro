const generateCode = (value) => {
    let output = ''
    value = value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(" ")
        .join("")
        
    // Sửa ở đây: Sử dụng REACT_APP_... cho Client và SECRET_GENERATE cho Server
    let secret = process.env.REACT_APP_SECRET_GENERATE || process.env.SECRET_GENERATE || 'phongtro'
    
    let merge = value + secret
    let length = merge.length

    for (let i = 0; i < 3; i++) {
        let index = i === 2 ? Math.floor(merge.length / 2 + length / 2) : Math.floor(length / 2)
        output += merge.charAt(index)
        length = index
    }
    return `${value.charAt(2)}${output}`.toUpperCase()
}

export default generateCode