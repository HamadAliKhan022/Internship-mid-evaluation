import FormSelectField from "../forms/FormSelectField";

const categoryOptions = [
  { label: "Web Development", value: "Web Development" },
  { label: "Mobile App", value: "Mobile App" },
  { label: "UI/UX Design", value: "UI/UX Design" },
  { label: "Data Science", value: "Data Science" },
  { label: "Other", value: "Other" }
];

function ProjectCategoryField({ control, trigger }) {
  return (
    <FormSelectField
      name="category"
      control={control}
      trigger={trigger}
      label="Project Category"
      options={categoryOptions}
      rules={{
        required: "Project category is required."
      }}
    />
  );
}

export default ProjectCategoryField;
