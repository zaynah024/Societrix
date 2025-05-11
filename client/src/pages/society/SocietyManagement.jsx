import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocieties, editDescription } from '../../features/society/societySlice';

const SocietyManagement = () => {
  const dispatch = useDispatch();
  const { societies, status } = useSelector((state) => state.society);

  const [selectedSociety, setSelectedSociety] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');

  useEffect(() => {
    dispatch(fetchSocieties());
  }, [dispatch]);

  useEffect(() => {
    if (societies.length > 0) {
      setSelectedSociety(societies[0]);
      setMembers(societies[0].members || []);
      setNewDescription(societies[0].description || '');
    }
  }, [societies]);

  const handleTabChange = (value) => {
    const society = societies.find(s => s._id === value);
    setSelectedSociety(society);
    setMembers(society.members || []);
    setNewDescription(society.description || '');
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedSociety) return;
    dispatch(editDescription({ id: selectedSociety._id, description: newDescription }))
      .unwrap()
      .then(() => {
        setIsEditModalOpen(false);
      });
  };

  const handleAddMember = () => {
    if (newMember.trim() === '') return;
    setMembers(prev => [...prev, newMember.trim()]);
    setNewMember('');
  };

  if (status === 'loading' || !selectedSociety) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <Tabs value={selectedSociety._id} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          {societies.map((society) => (
            <TabsTrigger key={society._id} value={society._id}>
              {society.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {societies.map((society) => (
          <TabsContent key={society._id} value={society._id}>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">{society.name}</h2>
                  <Button variant="outline" onClick={handleEditClick}>Edit Description</Button>
                </div>
                <p className="mb-4">{society.description}</p>

                <h3 className="text-lg font-medium mb-2">Members</h3>
                <ScrollArea className="h-32 w-full rounded-md border mb-2">
                  <ul className="p-2">
                    {members.map((member, idx) => (
                      <li key={idx} className="py-1 border-b last:border-none">{member}</li>
                    ))}
                  </ul>
                </ScrollArea>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add member"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                  />
                  <Button onClick={handleAddMember}>Add</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Description</h2>
            <textarea
              className="w-full border rounded p-2 mb-4"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveChanges}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocietyManagement;