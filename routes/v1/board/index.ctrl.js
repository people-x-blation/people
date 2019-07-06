export const list = (req,res) => {
    res.render("board/list");
};

export const read = (req,res) => {
    res.render("board/read");
}

export const search = (req,res) => {
    res.render("board/search");
}

export const write = (req,res) => {
    res.render("board/write");
}