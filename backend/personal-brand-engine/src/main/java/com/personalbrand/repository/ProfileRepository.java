package com.personalbrand.repository;

import com.personalbrand.entity.Profile;
import com.personalbrand.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUser(User user);

    @Query("SELECT p FROM Profile p WHERE p.user.id = :userId")
    List<Profile> findAllByUserId(@Param("userId") Long userId);

    default Optional<Profile> findByUserId(Long userId) {
        List<Profile> profiles = findAllByUserId(userId);
        return profiles.isEmpty() ? Optional.empty() : Optional.of(profiles.get(0));
    }
}

