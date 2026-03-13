import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Minus, Plus } from "lucide-react";
import type { Product } from "../../types/product";
import { ProductFormSchema } from "../../utils/validators";
import type {
  ProductFormValues,
  ProductFormData,
} from "../../utils/validators";

export interface ProductFormProps {
  defaultValues?: Partial<Product>;
  onSubmit: (data: ProductFormValues) => void | Promise<void>;
  isLoading?: boolean;
  mode: "add" | "edit";
}

/* Helper: cheap check whether a string looks like a usable image URL */
const isValidImageUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/* CSS var-driven input base — applied via style + className */
const inputBase =
  "block w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200";
const labelClass = "block mb-1.5 text-sm font-medium";
const errorClass = "mt-1 text-xs";

const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues,
  onSubmit,
  isLoading = false,
  mode,
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      price: defaultValues?.price ?? 0,
      category: defaultValues?.category ?? "",
      description: defaultValues?.description ?? "",
      image: defaultValues?.image ?? "",
      inStock: defaultValues?.inStock ?? false,
      stockCount: defaultValues?.stockCount ?? 0,
    },
  });

  const knownCategories = [
    "beauty",
    "fragrances",
    "furniture",
    "groceries",
    "automotive",
    "home-decoration",
    "laptops",
    "lighting",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "motorcycle",
    "skincare",
    "smartphones",
    "sports-accessories",
    "sunglasses",
    "tablets",
    "tops",
    "vehicle",
    "womens-bags",
    "womens-dresses",
    "womens-jewellery",
    "womens-shoes",
    "womens-watches",
  ];

  const initialIsOther =
    !!defaultValues?.category &&
    !knownCategories.includes(defaultValues.category);

  const [isOtherCategory, setIsOtherCategory] = useState(initialIsOther);
  const [customCategory, setCustomCategory] = useState(
    initialIsOther ? (defaultValues?.category ?? "") : "",
  );

  const watchInStock = useWatch({ control, name: "inStock" });
  const watchImage = watch("image");
  const [imgError, setImgError] = useState(false);

  const showPreview = isValidImageUrl(watchImage) && !imgError;

  const handleFormSubmit = (data: ProductFormValues) => {
    onSubmit({
      ...data,
      inStock: data.inStock,
      stockCount: data.inStock ? data.stockCount : 0,
    });
  };

  const inputStyle = {
    backgroundColor: "var(--bg-tertiary)",
    borderColor: "var(--border)",
    color: "var(--text-primary)",
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className={labelClass}
          style={{ color: "var(--text-secondary)" }}
        >
          Title <span style={{ color: "var(--c-danger)" }}>*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="Product title"
          className={`${inputBase} field-input`}
          style={{
            ...inputStyle,
            borderColor: errors.title ? "var(--c-danger)" : "var(--border)",
          }}
          {...register("title")}
        />
        {errors.title && (
          <p className={errorClass} style={{ color: "var(--c-danger)" }}>
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className={labelClass}
          style={{ color: "var(--text-secondary)" }}
        >
          Price ($) <span style={{ color: "var(--c-danger)" }}>*</span>
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className={`${inputBase} field-input`}
          style={{
            ...inputStyle,
            borderColor: errors.price ? "var(--c-danger)" : "var(--border)",
          }}
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price && (
          <p className={errorClass} style={{ color: "var(--c-danger)" }}>
            {errors.price.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className={labelClass}
          style={{ color: "var(--text-secondary)" }}
        >
          Category <span style={{ color: "var(--c-danger)" }}>*</span>
        </label>
        <select
          id="category"
          className={`${inputBase} field-input`}
          style={{
            ...inputStyle,
            borderColor: errors.category ? "var(--c-danger)" : "var(--border)",
          }}
          value={isOtherCategory ? "__other__" : undefined}
          {...register("category")}
          onChange={(e) => {
            if (e.target.value === "__other__") {
              setIsOtherCategory(true);
              setValue("category", customCategory, { shouldValidate: true });
            } else {
              setIsOtherCategory(false);
              setCustomCategory("");
              register("category").onChange(e);
            }
          }}
        >
          <option value="">— Select a category —</option>
          <option value="beauty">Beauty</option>
          <option value="fragrances">Fragrances</option>
          <option value="furniture">Furniture</option>
          <option value="groceries">Groceries</option>
          <option value="automotive">Automotive</option>
          <option value="home-decoration">Home Decoration</option>
          <option value="laptops">Laptops</option>
          <option value="lighting">Lighting</option>
          <option value="mens-shirts">Men's Shirts</option>
          <option value="mens-shoes">Men's Shoes</option>
          <option value="mens-watches">Men's Watches</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="skincare">Skincare</option>
          <option value="smartphones">Smartphones</option>
          <option value="sports-accessories">Sports Accessories</option>
          <option value="sunglasses">Sunglasses</option>
          <option value="tablets">Tablets</option>
          <option value="tops">Tops</option>
          <option value="vehicle">Vehicle</option>
          <option value="womens-bags">Women's Bags</option>
          <option value="womens-dresses">Women's Dresses</option>
          <option value="womens-jewellery">Women's Jewellery</option>
          <option value="womens-shoes">Women's Shoes</option>
          <option value="womens-watches">Women's Watches</option>
          <option value="__other__">Other…</option>
        </select>

        {/* Custom category input */}
        {isOtherCategory && (
          <input
            type="text"
            placeholder="Enter custom category"
            className={`${inputBase} field-input mt-2`}
            style={{
              ...inputStyle,
              borderColor: errors.category
                ? "var(--c-danger)"
                : "var(--border)",
            }}
            value={customCategory}
            onChange={(e) => {
              setCustomCategory(e.target.value);
              setValue("category", e.target.value, { shouldValidate: true });
            }}
          />
        )}
        {errors.category && (
          <p className={errorClass} style={{ color: "var(--c-danger)" }}>
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className={labelClass}
          style={{ color: "var(--text-secondary)" }}
        >
          Description <span style={{ color: "var(--c-danger)" }}>*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the product…"
          className={`${inputBase} field-input resize-y`}
          style={{
            ...inputStyle,
            borderColor: errors.description
              ? "var(--c-danger)"
              : "var(--border)",
          }}
          {...register("description")}
        />
        {errors.description && (
          <p className={errorClass} style={{ color: "var(--c-danger)" }}>
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label
          htmlFor="image"
          className={labelClass}
          style={{ color: "var(--text-secondary)" }}
        >
          Image URL <span style={{ color: "var(--c-danger)" }}>*</span>
        </label>
        <input
          id="image"
          type="url"
          placeholder="https://example.com/image.jpg"
          className={`${inputBase} field-input`}
          style={{
            ...inputStyle,
            borderColor: errors.image ? "var(--c-danger)" : "var(--border)",
          }}
          {...register("image")}
          onChange={(e) => {
            setImgError(false);
            register("image").onChange(e);
          }}
        />
        {errors.image && (
          <p className={errorClass} style={{ color: "var(--c-danger)" }}>
            {errors.image.message}
          </p>
        )}

        {/* Live preview */}
        {showPreview && (
          <div
            className="mt-3 flex items-center justify-center rounded-xl p-3"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
            }}
          >
            <img
              src={watchImage}
              alt="Preview"
              onError={() => setImgError(true)}
              className="max-h-40 max-w-full rounded-lg object-contain"
            />
          </div>
        )}
      </div>

      {/* ===== STOCK SECTION ===== */}
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${watchInStock ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--bg-tertiary)]"}`}
      >
        {/* In Stock Toggle Row */}
        <Controller
          name="inStock"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  In Stock
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  Is this product currently available?
                </span>
              </div>

              {/* Toggle Switch */}
              <label
                className="relative inline-flex cursor-pointer items-center flex-shrink-0"
                aria-label="In Stock toggle"
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={!!field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    if (!e.target.checked) setValue("stockCount", 0);
                  }}
                />
                <div className="h-6 w-11 rounded-full transition-colors bg-[var(--border)] peer-checked:bg-[var(--accent)] after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:after:translate-x-5" />
              </label>
            </div>
          )}
        />

        {/* Stock Count — only visible when inStock is ON */}
        {watchInStock && (
          <Controller
            name="stockCount"
            control={control}
            render={({ field }) => (
              <div className="px-5 pb-4 flex flex-col gap-2 border-t border-[var(--accent)]/20">
                <div className="flex flex-col gap-0.5 pt-3">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    Stock Count
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    How many units are currently available?
                  </span>
                </div>

                {/* Increment / Decrement Input */}
                <div className="flex items-center rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(Math.max(0, (field.value ?? 0) - 1))
                    }
                    className="w-12 h-12 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={field.value ?? 0}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      field.onChange(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="flex-1 h-12 text-center bg-transparent text-[var(--text-primary)] font-bold text-xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  <button
                    type="button"
                    onClick={() => field.onChange((field.value ?? 0) + 1)}
                    className="w-12 h-12 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Stock level feedback */}
                {(field.value ?? 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${(field.value ?? 0) <= 5 ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}
                    />
                    <span
                      className={`text-xs font-medium ${(field.value ?? 0) <= 5 ? "text-amber-500" : "text-green-500"}`}
                    >
                      {(field.value ?? 0) <= 5
                        ? `Low stock — only ${field.value} left`
                        : `${field.value} units available`}
                    </span>
                  </div>
                )}

                {(field.value ?? 0) === 0 && (
                  <div className="flex items-center gap-2">
                    <AlertCircle
                      size={13}
                      className="text-amber-500 flex-shrink-0"
                    />
                    <span className="text-xs text-amber-500">
                      Enter at least 1 unit if product is in stock
                    </span>
                  </div>
                )}

                {errors.stockCount && (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle
                      size={13}
                      className="text-red-500 flex-shrink-0"
                    />
                    <p className="text-xs text-red-500">
                      {errors.stockCount.message}
                    </p>
                  </div>
                )}
              </div>
            )}
          />
        )}
      </div>
      {/* ===== END STOCK SECTION ===== */}

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-xl font-heading font-semibold text-white text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
          style={{ backgroundColor: "var(--accent)" }}
          onMouseEnter={(e) => {
            if (!isLoading)
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--accent-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--accent)";
          }}
        >
          {isLoading
            ? "Saving…"
            : mode === "add"
              ? "Add Product"
              : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isLoading}
          className="h-11 w-full rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--bg-tertiary)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent")
          }
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
