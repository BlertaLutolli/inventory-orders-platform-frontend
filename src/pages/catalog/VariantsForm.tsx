import { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FormRow from "../../components/ui/FormRow";
import { variantsApi, productsApi, uomsApi } from "../../api/catalogApi";
import { Product, UnitOfMeasure, Variant } from "../../types/catalog";

const schema = Yup.object({
  productId: Yup.string().required("Required"),
  uomId: Yup.string().required("Required"),
  sku: Yup.string().min(1, "Too short").max(64, "Too long").required("Required"),
  price: Yup.number().min(0, ">= 0").required("Required"),
});

type Props = {
  existing?: Partial<Variant> | null;
  onSaved: (saved: Variant) => void;
  onCancel: () => void;
};

export default function VariantsForm({ existing, onSaved, onCancel }: Props) {
  const isEdit = Boolean(existing?.id);
  const [products, setProducts] = useState<Product[]>([]);
  const [uoms, setUoms] = useState<UnitOfMeasure[]>([]);

  useEffect(() => {
    productsApi.all().then(setProducts).catch(() => setProducts([]));
    uomsApi.all().then(setUoms).catch(() => setUoms([]));
  }, []); // <-- this line was missing a closing ))
  //        and we finish the useEffect with a semicolon above.

  return (
    <Formik
      enableReinitialize
      initialValues={{
        productId: (existing as any)?.productId ?? "",
        uomId:     (existing as any)?.uomId ?? "",
        sku:       (existing as any)?.sku ?? "",
        price:     (existing as any)?.price ?? 0,
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const payload = {
            productId: values.productId,
            uomId: values.uomId,
            sku: values.sku,
            price: Number(values.price),
          };
          const saved = isEdit
            ? await variantsApi.update(existing!.id!, payload)
            : await variantsApi.create(payload);
          onSaved(saved);
        } finally { setSubmitting(false); }
      }}
    >
      {({ values, handleChange, isSubmitting, setFieldValue }) => (
        <Form className="space-y-4">
          <FormRow>
            <div style={{ flex: 1 }}>
              <label className="block text-sm mb-1">Product</label>
              <select
                name="productId"
                value={values.productId}
                onChange={(e) => setFieldValue("productId", e.target.value)}
                className="input"
              >
                <option value="">— select —</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <div className="text-red-500 text-sm"><ErrorMessage name="productId" /></div>
            </div>

            <div style={{ flex: 1 }}>
              <label className="block text-sm mb-1">UoM</label>
              <select
                name="uomId"
                value={values.uomId}
                onChange={(e) => setFieldValue("uomId", e.target.value)}
                className="input"
              >
                <option value="">— select —</option>
                {uoms.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <div className="text-red-500 text-sm"><ErrorMessage name="uomId" /></div>
            </div>
          </FormRow>

          <FormRow>
            <div style={{ flex: 1 }}>
              <Input label="SKU" name="sku" value={values.sku} onChange={handleChange} />
              <div className="text-red-500 text-sm"><ErrorMessage name="sku" /></div>
            </div>
            <div style={{ flex: 1 }}>
              <Input type="number" step="0.01" label="Price" name="price" value={String(values.price)} onChange={handleChange} />
              <div className="text-red-500 text-sm"><ErrorMessage name="price" /></div>
            </div>
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
