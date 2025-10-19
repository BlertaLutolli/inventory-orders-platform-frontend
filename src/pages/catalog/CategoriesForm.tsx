import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FormRow from "../../components/ui/FormRow";
import { categoriesApi } from "../../api/catalogApi";
import { Category } from "../../types/catalog";

const schema = Yup.object({
  name: Yup.string().min(2, "Too short").max(100, "Too long").required("Required"),
  code: Yup.string().min(2, "Too short").max(50, "Too long").required("Required"),
});

type Props = {
  existing?: Partial<Category> | null;
  onSaved: (saved: Category) => void;
  onCancel: () => void;
};

export default function CategoriesForm({ existing, onSaved, onCancel }: Props) {
  const isEdit = Boolean(existing?.id);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: existing?.name ?? "",
        code: existing?.code ?? "",
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const saved = isEdit
            ? await categoriesApi.update(existing!.id!, values)
            : await categoriesApi.create(values);
          onSaved(saved);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, isSubmitting }) => (
        <Form className="space-y-4">
          <FormRow>
            <div style={{ flex: 1 }}>
              <Input
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
              <div className="text-red-500 text-sm"><ErrorMessage name="name" /></div>
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label="Code"
                name="code"
                value={values.code}
                onChange={handleChange}
              />
              <div className="text-red-500 text-sm"><ErrorMessage name="code" /></div>
            </div>
          </FormRow>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button type="button" onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {isEdit ? "Save changes" : "Create"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
