'use server';

export const RegisterUser = async (data: any) => {
  try {
    const user = await fetch(`${process.env.SERVER_URL}auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    console.log(user);

    return user;
  } catch (error) {
    console.log(error);
  }
};
