import { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FormRow from "../../components/ui/FormRow";
import { productsApi, categoriesApiAll } from "../../api/catalogApi";
import { Category, Product } from "../../types/catalog";

const schema = Yup.object({
  name: Yup.string().min(2, "Too short").max(100, "Too long").required("Required"),
  code: Yup.string().min(2, "Too short").max(50, "Too long").required("Required"),
  categoryId: Yup.string().nullable(),
});

type Props = {
  existing?: Partial<Product> | null;
  onSaved: (saved: Product) => void;
  onCancel: () => void;
};

export default function ProductsForm({ existing, onSaved, onCancel }: Props) {
  const isEdit = Boolean(existing?.id);
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApiAll.all().then(setCats).catch(() => setCats([]));
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: existing?.name ?? "",
        code: existing?.code ?? "",
        categoryId: (existing as any)?.categoryId ?? "",
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const payload = {
            name: values.name,
            code: values.code,
            categoryId: values.categoryId || undefined,
          };
          const saved = isEdit
            ? await productsApi.update(existing!.id!, payload)
            : await productsApi.create(payload);
          onSaved(saved);
        } finally { setSubmitting(false); }
      }}
    >
      {({ values, handleChange, isSubmitting, setFieldValue }) => (
        <Form className="space-y-4">
          <FormRow>
            <div style={{ flex: 1 }}>
              <Input label="Name" name="name" value={values.name} onChange={handleChange} />
              <div className="text-red-500 text-sm"><ErrorMessage name="name" /></div>
            </div>
            <div style={{ flex: 1 }}>
              <Input label="Code" name="code" value={values.code} onChange={handleChange} />
              <div className="text-red-500 text-sm"><ErrorMessage name="code" /></div>
            </div>
          </FormRow>

          <FormRow>
            <div style={{ flex: 1 }}>
              <label className="block text-sm mb-1">Category</label>
              <select
                name="categoryId"
                value={values.categoryId || ""}
                onChange={(e) => setFieldValue("categoryId", e.target.value)}
                className="input"
              >
                <option value="">— none —</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="text-red-500 text-sm"><ErrorMessage name="categoryId" /></div>
            </div>
            <div style={{ flex: 1 }} />
          </FormRow>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button type="button" onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>{isEdit ? "Save changes" : "Create"}</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
