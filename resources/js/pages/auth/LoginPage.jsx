import React from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import AuthLayout from "@/layouts/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/auth/login/post", {
            onSuccess: () => router.visit("/todos"), // redirect ke IndexPage
        });
    };

    return (
        <AuthLayout>
            <Card className="bg-white shadow-lg rounded-lg w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Masuk ke akun Anda</CardTitle>
                    <CardDescription>Masukkan email untuk login</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contoh@email.com"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Masukkan kata sandi"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                            </Field>

                            <Field>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? "Memproses..." : "Masuk"}
                                </Button>
                                <FieldDescription className="text-center">
                                    Belum punya akun?{" "}
                                    <a href="/auth/register" className="text-blue-600 hover:underline">
                                        Daftar di sini
                                    </a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
