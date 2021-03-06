package org.hackbrooklyn.plaza.repository;

import org.hackbrooklyn.plaza.model.TeamFormationParticipant;
import org.hackbrooklyn.plaza.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamFormationParticipantRepository extends JpaRepository<TeamFormationParticipant, Integer> {

    Optional<TeamFormationParticipant> findFirstByUser(User user);
}
