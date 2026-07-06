import FormMultiSelectField from "../forms/FormMultiSelectField";
import FormTextField from "../forms/FormTextField";

const technologyOptions = {
  "Web Development": [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "TypeScript"
  ],
  "Mobile App": [
    "React Native",
    "Flutter",
    "Firebase",
    "Expo",
    "Android",
    "iOS"
  ],
  "UI/UX Design": [
    "Figma",
    "Adobe XD",
    "Sketch",
    "Protopie",
    "Framer"
  ],
  "Data Science": [
    "Python",
    "R",
    "Pandas",
    "NumPy",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Jupyter"
  ]
};

function TechStackField({ control, trigger, category }) {
  const categoryTechnologies = technologyOptions[category] || [];

  if (category === "Other") {
    return (
      <FormTextField
        name="otherTechStack"
        control={control}
        trigger={trigger}
        label="Tech Stack"
        placeholder="Example: Laravel, MySQL, Bootstrap"
        rules={{
          required: "Tech stack is required.",
          validate: (value) =>
            value.trim().length >= 2 ||
            "Enter your technology details."
        }}
      />
    );
  }

  return (
    <FormMultiSelectField
      name="techStack"
      control={control}
      trigger={trigger}
      label="Tech Stack"
      options={categoryTechnologies}
      helperText="Select one or more technologies."
      rules={{
        validate: (value) =>
          Array.isArray(value) && value.length > 0
            ? true
            : "Select at least one technology."
      }}
    />
  );
}

export default TechStackField;
