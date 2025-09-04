# Taskify Database Setup Instructions

## Supabase Configuration

### 1. Access Your Supabase Project

- Log in to [Supabase Dashboard](https://supabase.com)
- Navigate to your project using the URL: `https://*******.supabase.co`

### 2. Create Tasks Table

Go to the SQL Editor in your Supabase dashboard and run the following SQL:

```sql
-- Create tasks table
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    category TEXT,
    due_date TIMESTAMPTZ,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks table
CREATE POLICY "Users can view their own tasks" ON tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
    FOR DELETE USING (auth.uid() = user_id);
```

### 3. Create Task Shares Table (for collaboration)

```sql
-- Create task_shares table for collaboration
CREATE TABLE task_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_with_email TEXT NOT NULL,
    permission TEXT DEFAULT 'view' CHECK (permission IN ('view', 'edit')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for task_shares
ALTER TABLE task_shares ENABLE ROW LEVEL SECURITY;

-- Policies for task_shares
CREATE POLICY "Users can view shares for their tasks" ON task_shares
    FOR SELECT USING (
        shared_by = auth.uid() OR
        shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

CREATE POLICY "Users can create shares for their tasks" ON task_shares
    FOR INSERT WITH CHECK (
        shared_by = auth.uid() AND
        EXISTS (SELECT 1 FROM tasks WHERE id = task_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can delete their own shares" ON task_shares
    FOR DELETE USING (shared_by = auth.uid());
```

### 4. Enable Google OAuth

1. Go to **Authentication > Providers** in your Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Get Client ID and Client Secret from [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or use existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `https://**********************.supabase.co/auth/v1/callback`

### 5. Enable Realtime (Optional)

```sql
-- Enable realtime for tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

### 6. Test Connection

### 7. Verify Setup

After running the SQL commands, verify that:

- Tables are created successfully
- RLS policies are active
- Triggers are working
- Google OAuth is configured

The database is now ready for the Taskify application!

### 8. Create Notes Table

```sql
-- Create notes table
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger for notes
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for notes table
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for notes table
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
```

### 9. Create Task-Note Relationships Table (Optional)

```sql
-- Create task_notes table for linking tasks and notes
CREATE TABLE task_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(task_id, note_id)
);

-- Enable RLS for task_notes
ALTER TABLE task_notes ENABLE ROW LEVEL SECURITY;

-- Policies for task_notes
CREATE POLICY "Users can view their task-note relationships" ON task_notes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM tasks WHERE id = task_id AND user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM notes WHERE id = note_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can create task-note relationships" ON task_notes
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM tasks WHERE id = task_id AND user_id = auth.uid()) AND
        EXISTS (SELECT 1 FROM notes WHERE id = note_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can delete their task-note relationships" ON task_notes
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM tasks WHERE id = task_id AND user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM notes WHERE id = note_id AND user_id = auth.uid())
    );
```
