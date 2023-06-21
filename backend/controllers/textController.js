import Text from "../models/textModel.js";

// Get the text
const getText = async (req, res) => {
  try {
    const text = await Text.findOne();
    res.json(text);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update the text
const updateText = async (req, res) => {
  const { text } = req.body;

  try {
    let existingText = await Text.findOne();
    if (!existingText) {
      // If no text exists, create a new document
      existingText = new Text({ text });
    } else {
      // If text already exists, update it
      existingText.text = text;
    }
    await existingText.save();
    res.json({ message: "Text updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { getText, updateText };
