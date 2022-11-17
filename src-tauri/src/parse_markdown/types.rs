#[derive(Debug, Clone, Copy)]
pub enum TypeLine {
    Title,
    BlockQuote,
    Code,
    List,
    Paragraph,
    LineBreak,
}

impl TypeLine {
    pub fn get_value(&self) -> &str {
        match &self {
            TypeLine::Title => "Title",
            TypeLine::BlockQuote => "BlockQuote",
            TypeLine::Code => "Code",
            TypeLine::List => "List",
            TypeLine::Paragraph => "Paragraph",
            TypeLine::LineBreak => "LineBreak",
        }
    }
}

impl PartialEq for TypeLine {
    fn eq(&self, other: &Self) -> bool {
        self.get_value() == other.get_value()
    }
}
