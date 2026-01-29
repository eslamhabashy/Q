-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This triggers a function every time a new user signs up
-- to copy the user data to the profiles table.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create conversations table
create table conversations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null default 'New Conversation'
);

-- Enable RLS for conversations
alter table conversations enable row level security;

create policy "Users can view their own conversations" on conversations
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own conversations" on conversations
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own conversations" on conversations
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own conversations" on conversations
  for delete using ((select auth.uid()) = user_id);

-- Create messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null
);

-- Enable RLS for messages
alter table messages enable row level security;

-- Policy for messages: Users can see messages if they own the conversation
create policy "Users can view messages in their conversations" on messages
  for select using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = (select auth.uid())
    )
  );

-- Policy for messages: Users can insert messages into their conversations
create policy "Users can insert messages into their conversations" on messages
  for insert with check (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = (select auth.uid())
    )
  );
