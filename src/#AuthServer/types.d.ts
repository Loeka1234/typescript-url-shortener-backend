interface AddUrlBody {
    slug: string;
    url: string;
    customSlug: boolean;
    publicUrl: boolean;
}

 interface RegisterBody {
    email: string;
    password: string;
    name: string;
}
 interface LoginBody {
    email: string;
    password: string;
}