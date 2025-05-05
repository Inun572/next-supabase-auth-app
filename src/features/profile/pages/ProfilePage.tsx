import AuthRoute from "~/components/layout/AuthRoute";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useState, useRef, useEffect, useMemo } from "react";
import { api } from "~/utils/api";
import { EditProfileFormInner } from "../components/EditProfileFormInner";
import { Form } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileFormSchema, type EditProfileFormSchema } from "../forms/edit-profile";
import { toast } from "sonner";
import { TRPCClientError } from "@trpc/client";

const ProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState<File | undefined | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const { data: getProfileData } = api.profile.getProfile.useQuery();

  const apiUtils = api.useUtils();
  const handleOpenFileExplorer = () => {
    inputFileRef.current?.click();
  };

  const form = useForm<EditProfileFormSchema>({
    defaultValues: {
      bio: getProfileData?.bio || "",
      username: getProfileData?.username,
    },
    resolver: zodResolver(editProfileFormSchema)
  });

  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: (data) => {
      form.reset({
        bio: data.bio ?? "",
        username: data.username,
      });
      toast.success("Berhasil update profile");
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        if (err.message === "USERNAME_USED") {
          form.setError("username", {
            message: "Username sudah digunakan",
          });
        }
      }
      toast.error("Gagal update profile");
    },
  });

  const onSubmitUpdateProfile = async (values: EditProfileFormSchema) => {
    if (!form.formState.isDirty) return

    const payload: {
      username?: string | undefined;
      bio?: string | undefined;
    } = {}

    if (values.username !== getProfileData?.username) {
      payload.username = values.username;
    }

    if (values.bio !== getProfileData?.bio) {
      payload.bio = values.bio;
    }

    await updateProfile.mutateAsync({...payload});
  }

  const updateProfilePicture = api.profile.updateProfilePicture.useMutation({
    onSuccess: async () => {
      toast.success("Berhasil mengubah foto profil");
      setSelectedImage(null);
      await apiUtils.profile.getProfile.invalidate();
    },
    onError: () => {
      toast.error("Gagal mengubah foto profil");
    },
  });

  const onPickProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setSelectedImage(file);
  }

  const selectedProfilePicturePreview = useMemo(() => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    }
  }, [selectedImage]);

  const handleUpdateProfilePicture = async () => {
    if (!selectedImage) return;

      const reader = new FileReader();

      reader.onloadend = function () {
        const result = reader.result as string;
        const imageBase64 = result.substring(result.indexOf(",") + 1);

        updateProfilePicture.mutate(imageBase64);
      };

      reader.readAsDataURL(selectedImage);
  }

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    if (getProfileData) {
      form.setValue("username", getProfileData.username ?? "");
      form.setValue("bio", getProfileData.bio ?? "");
    }
  }, [getProfileData]);

  return (
    <AuthRoute>
      <PageContainer>
        <SectionContainer padded minfullscreen className="gap-y-6 py-8">
          <h1 className="text-3xl font-semibold">Profile Settings</h1>

          <Card>
            <CardContent className="flex gap-6 pt-6">
              <div className="flex flex-col gap-2">
                <Avatar className="size-24 text-3xl">
                  <AvatarFallback>{getProfileData?.username.split(" ").map(name => name[0]).join("").toUpperCase()}</AvatarFallback>
                  <AvatarImage src={selectedProfilePicturePreview ?? getProfileData?.profilePictureUrl ?? ""}/>
                </Avatar>
                <Button onClick={handleOpenFileExplorer} size="sm">
                  Ganti Foto
                </Button>
                {!!selectedImage && (
                  <>
                    <Button
                      onClick={handleRemoveSelectedImage}
                      variant="destructive"
                      size="sm"
                    >
                      Hapus
                    </Button>
                    <Button onClick={handleUpdateProfilePicture} size="sm">
                      Simpan
                    </Button>
                  </>
                )}
                <input className="hidden" type="file" ref={inputFileRef} onChange={onPickProfilePicture}/>
              </div>

              <div className="flex-1">
                {/* TODO: Skeleton when loading data */}
                {getProfileData ? (
                  <Form {...form}>
                    <EditProfileFormInner 
                      defaultValues={
                        {
                          bio: getProfileData?.bio || "",
                          username: getProfileData?.username,
                        }
                      }
                    />
                  </Form>
                )
                : (
                  <div className="flex h-full w-full items-center justify-center">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex w-full justify-end gap-4">
            <Button onClick={form.handleSubmit(onSubmitUpdateProfile)} disabled={!form.formState.isDirty}>Simpan</Button>
          </div>
        </SectionContainer>
      </PageContainer>
    </AuthRoute>
  );
};

export default ProfilePage;
