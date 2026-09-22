UPDATE content_items
SET archetype = 'Lone Wolf',
    updated_at = CURRENT_TIMESTAMP
WHERE archetype IN ('The Exile', 'Exile', 'The Lone Wolf');
