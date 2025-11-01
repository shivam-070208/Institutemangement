export const getDemo = (req, res) => {
    const id = req.params.id;
    res.json({ message: `This is a demo response from the controller for ID: ${id}` });
};  
