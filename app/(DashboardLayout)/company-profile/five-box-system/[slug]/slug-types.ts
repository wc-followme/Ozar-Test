export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface QuestionItem {
  id: number;
  text: string;
  answer: string;
}

export interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export interface FormConfig {
  title: string;
  fields: Array<{
    name: string;
    label: string;
  }>;
}
