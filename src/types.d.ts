export interface AddUrlBody {
    slug: string;
    url: string;
    customSlug: boolean;
    publicUrl: boolean;
}

export interface RegisterBody {
    email: string;
    password: string;
    name: string;
}
export interface LoginBody {
    email: string;
    password: string;
}
